/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  CaseBattle,
  CaseBattleBotPlayer,
  CaseBattlePlayer,
  CaseBattlePlayers,
  CaseDrop,
  ParsedCaseBattle,
  ToastProps
} from '$lib';
import { PrismaClient, type User } from '@prisma/client';
import { randomInt } from 'crypto';
import { Server } from 'socket.io';
import type { Plugin } from 'vite';
import { dropsToItems } from './dropToItem';
import { parseCaseBattle } from './parseCaseBattle';

const bots: CaseBattleBotPlayer[] = [
  {
    id: '0',
    username: 'Bot 1',
    pfpUrl: 'https://cdn.key-drop.com/battleBot/avatar1x.png',
    bot: true
  },
  {
    id: '2',
    username: 'Bot 2',
    pfpUrl: 'https://cdn.key-drop.com/battleBot/avatar2x.png',
    bot: true
  },
  {
    id: '3',
    username: 'Bot 3',
    pfpUrl: 'https://cdn.key-drop.com/battleBot/avatar3x.png',
    bot: true
  },
  {
    id: '4',
    username: 'Bot 4',
    pfpUrl: 'https://cdn.key-drop.com/battleBot/avatar4x.png',
    bot: true
  }
];

export const webSocketServer: Plugin = {
  name: 'webSocketServer',
  configureServer(server) {
    interface ServerToClientEvents {
      caseBattleListUpdate: (caseBattles: CaseBattle[]) => void;
      caseBattlePlayerUpdate: (players: CaseBattlePlayers) => void;
      caseBattleStateChange: (state: boolean, winnerPos: number) => void;
      caseBattleOwnerUpdate: (ownerID: string) => void;
      redirect: (url: string) => void;
      error: (header: string, messageKey: string, type: ToastProps['type']) => void;
    }

    interface ClientToServerEvents {
      caseBattlePlayerLeave: (caseBattleID: number, userData: User, position: number) => void;
      caseBattlePlayerJoin: (
        caseBattleID: number,
        userData: User | null,
        position: number,
        isBot: boolean
      ) => void;
      caseBattleAddBot: (caseBattleID: number, position: number) => void;
      caseBattleAddAllBots: (caseBattleID: number) => void;
    }

    interface InterServerEvents {}
    interface SocketData {}

    const db = new PrismaClient();
    const io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(server.httpServer as any);

    setInterval(async () => {
      await db.caseBattle.deleteMany({
        where: {
          createdAt: {
            lt: new Date(new Date().getTime() - 60_000 * 20)
          }
        }
      });

      const battles = await db.caseBattle
        .findMany({
          where: {
            finished: false,
            public: true
          }
        })
        .catch(() => null);
      io.emit('caseBattleListUpdate', battles as any as CaseBattle[]);
    }, 1_000);

    io.on('connection', async (socket) => {
      // @ts-ignore
      const _battleID: string = socket.request._query['battleID'];

      if (_battleID) socket.join(_battleID);
      socket.on('caseBattlePlayerJoin', async (battleID, userData, position) => {
        const battle: CaseBattle = (await db.caseBattle.findUnique({
          where: {
            id: battleID
          },
          select: {
            players: true,
            playerCount: true,
            totalPrice: true,
            mode: true
          }
        })) as any;

        if (!battle || !battle.players) return;
        if (
          Object.values(battle.players)
            .map((p) => p.id)
            .includes(userData?.id)
        )
          return;
        if (userData && userData.balance < battle.totalPrice) {
          socket.emit(
            'error',
            'toasts.error.header',
            'toasts.error.messages.notEnoughBalance',
            'error'
          );
          return;
        }
        if (battle.players[position]) {
          socket.emit('error', 'toasts.error.header', 'toasts.error.messages.spotTaken', 'error');
          return;
        }
        battle.players[position] = userData ? { ...userData, bot: false } : bots[position];
        await db.caseBattle.update({
          where: {
            id: battleID
          },
          data: {
            players: battle.players as any
          }
        });

        updatePlayers(io, battleID, battle.players as any as CaseBattlePlayers);

        if (Object.values(battle.players).filter((v) => v).length === battle.playerCount) {
          const updatedBattle: CaseBattle = (await db.caseBattle.update({
            where: {
              id: battleID
            },
            data: {
              finished: true
            }
          })) as any;

          const parsedBattle: ParsedCaseBattle = await parseCaseBattle(updatedBattle, false, true);

          const playerStats: {
            [key: number]: { total: number; user: CaseBattleBotPlayer | CaseBattlePlayer };
          } = {};
          let allDrops: CaseDrop[] = [];
          // prettier-ignore
          for (const [pos, user] of Object.entries(updatedBattle.players as any as CaseBattlePlayers)) {
            if (!user.bot) {
              await db.user.update({
                where: {
                  id: user.id
                },
                data: {
                  balance: {
                    decrement: updatedBattle.totalPrice
                  }
                }
              });
            }

            const intPos = parseInt(pos);
            const totalValue = parsedBattle.wonItems[intPos].reduce((t, d) => t += d.skinPrice, 0);
            playerStats[intPos] = {
              user: user,
              total: totalValue 
            };
            allDrops = allDrops.concat(parsedBattle.wonItems[intPos]);
          }
          const keys = Object.keys(playerStats).map((str) => parseInt(str));
          const maxValue = Math.max(...keys.map((k) => playerStats[k].total));
          const minValue = Math.min(...keys.map((k) => playerStats[k].total));
          const compareVal = battle.mode === 'underdog' ? minValue : maxValue;
          const winningValues = keys.filter((k) => playerStats[k].total === compareVal);
          const itemsToAdd = dropsToItems(allDrops, 'CASE BATTLE');
          let winnerPos = winningValues[0];

          if (winningValues.length > 1)
            winnerPos = winningValues[randomInt(0, winningValues.length - 1)];

          if (!playerStats[winnerPos].user.bot) {
            await db.user.update({
              where: {
                id: playerStats[winnerPos].user.id
              },
              data: {
                inventory: {
                  create: itemsToAdd
                }
              }
            });
          }

          await db.caseBattle.update({
            where: {
              id: battleID
            },
            data: {
              winner: winnerPos
            }
          });

          io.to(battleID.toString()).emit('caseBattleStateChange', true, winnerPos);
          io.in(battleID.toString()).disconnectSockets();
        }
      });

      socket.on('caseBattlePlayerLeave', async (battleID, userData, position) => {
        const battle = await db.caseBattle.findUnique({
          where: {
            id: battleID
          },
          select: {
            players: true,
            owner: true
          }
        });

        if (!battle || !battle.players) return;

        if (battle.owner === userData.id && Object.values(battle.players).length > 1) {
          const newOwnerID = Object.values(battle.players).find(
            (p) => p.id !== battle.owner && !p.bot
          )?.id;
          if (!newOwnerID) {
            await db.caseBattle.delete({
              where: {
                id: battleID
              }
            });
            io.to(battleID.toString()).emit('redirect', 'case-battle/list');
            io.to(battleID.toString()).disconnectSockets();
            return;
          }
          await db.caseBattle.update({
            where: {
              id: battleID
            },
            data: {
              owner: newOwnerID
            }
          });
          io.to(battleID.toString()).emit('caseBattleOwnerUpdate', newOwnerID);
        }

        // @ts-ignore
        battle.players[position] = undefined;
        await db.caseBattle.update({
          where: {
            id: battleID
          },
          data: {
            players: battle.players
          }
        });

        updatePlayers(io, battleID, battle.players as any as CaseBattlePlayers);

        if (Object.values(battle.players).filter((p) => p).length === 0) {
          await db.caseBattle.delete({
            where: {
              id: battleID
            }
          });
          io.to(battleID.toString()).emit('redirect', 'case-battle/list');
          io.in(battleID.toString()).disconnectSockets();
        }
      });
    });
  }
};

function updatePlayers(io: Server, battleID: number, players: CaseBattlePlayers) {
  io.to(battleID.toString()).emit('caseBattlePlayerUpdate', players);
}
