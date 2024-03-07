/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';
import express from 'express';
import { createServer } from 'http';
import { nanoid } from 'nanoid';
import { Server } from 'socket.io';
import { handler } from '../build/handler.js';

const db = new PrismaClient();
const bots = [
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

const port = 10000;
const app = express();
const server = createServer(app);
const io = new Server(server);

try {
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
    io.emit('caseBattleListUpdate', battles);
  }, 25_000);

  io.on('connection', async (socket) => {
    // @ts-ignore
    const _battleID = socket.request._query['battleID'];

    if (_battleID) socket.join(_battleID);
    socket.on('caseBattlePlayerJoin', async (battleID, userData, position) => {
      const battle = await db.caseBattle.findUnique({
        where: {
          id: battleID
        },
        select: {
          players: true,
          playerCount: true,
          totalPrice: true,
          mode: true
        }
      });

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
          players: battle.players
        }
      });

      updatePlayers(io, battleID, battle.players);

      if (Object.values(battle.players).filter((v) => v).length === battle.playerCount) {
        const updatedBattle = await db.caseBattle.update({
          where: {
            id: battleID
          },
          data: {
            finished: true
          }
        });

        const parsedBattle = await parseCaseBattle(updatedBattle, false, true);

        const playerStats = {};
        let allDrops = [];
        // prettier-ignore
        for (const [pos, user] of Object.entries(updatedBattle.players)) {
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

      updatePlayers(io, battleID, battle.players);

      if (Object.values(battle.players).filter((v) => v).length === 0) {
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
} catch (e) {
  console.error(e);
}

app.use(handler);
server.listen(port, () => {
  console.log(`Listening on ${server.address().address}:` + port);
});

function updatePlayers(_io, battleID, players) {
  _io.to(battleID.toString()).emit('caseBattlePlayerUpdate', players);
}

function dropsToItems(drops, origin) {
  return drops.map((drop) => {
    return {
      dropId: nanoid(),
      origin: origin,
      dropDate: new Date(),
      globalInvItem: {
        connect: {
          id: drop.globalInvID
        }
      }
    };
  });
}

async function parseCaseBattle(battle, parseDrops, parseWonItems) {
  const parsedBattle = battle;

  if (parseDrops) {
    for (let i = 0; i < battle.playerCount; i++) {
      const parsedItems = [];
      const battleCaseDrops = battle.drops[i];
      for (const IDs of battleCaseDrops) {
        const items = await db.$transaction(
          IDs.map((id) =>
            db.caseDrop.findFirst({
              where: { id: id }
            })
          )
        );
        parsedItems.push(items);
      }
      parsedBattle.drops[i] = parsedItems;
    }
  } else if (parseWonItems) {
    for (let i = 0; i < battle.playerCount; i++) {
      const IDs = battle.wonItems[i];
      const items = await db.$transaction(
        IDs.map((id) =>
          db.caseDrop.findFirst({
            where: { id: id }
          })
        )
      );
      parsedBattle.wonItems[i] = items;
    }
  }
  return parsedBattle;
}
