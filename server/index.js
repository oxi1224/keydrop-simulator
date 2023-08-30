/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';
import express from 'express';
import { createServer } from 'http';
import { nanoid } from 'nanoid';
import { Server } from 'socket.io';
import { handler } from '../build/handler.js';

const db = new PrismaClient();
const WINNING_ITEM = 35;
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

const port = 8080;
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

    const battles = await db.caseBattle.findMany({
      where: {
        finished: false,
        public: true
      }
    });
    io.emit('caseBattleListUpdate', battles);
  }, 1000);
  
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
          totalPrice: true
        }
      });
  
      if (!battle || !battle.players) return;
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
  
        const parsedBattle = await parseCaseBattle(updatedBattle);
  
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
          const wonItems = parsedBattle.drops[intPos].map(arr => arr[WINNING_ITEM]).flat();
          const totalValue = wonItems.reduce((t, d) => t += d.skinPrice, 0);
          playerStats[intPos] = {
            user: user,
            total: totalValue 
          };
          allDrops = allDrops.concat(wonItems);
        }
        const keys = Object.keys(playerStats).map((str) => parseInt(str));
        const maxValue = Math.max(...keys.map((k) => playerStats[k].total));
        const highestValues = keys.filter((k) => playerStats[k].total === maxValue);
        const itemsToAdd = dropsToItems(allDrops, 'CASE BATTLE');
        let winnerPos = highestValues[0];
  
        if (highestValues.length > 1)
          winnerPos = highestValues[randomInt(0, highestValues.length - 1)];
  
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
  
      if (battle.owner === userData.id) {
        const newOwnerID = Object.values(battle.players).find((u) => u.id !== battle.owner).id;
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
    const globalItem = drop.globalInvItem;
    return {
      dropId: nanoid(),
      origin: origin,
      dropDate: new Date(),
      globalInvItem: {
        connect: {
          id: globalItem.id
        }
      }
    };
  });
}

export async function parseCaseBattle(battle) {
  const parsedBattle = battle;
  for (let i = 0; i < battle.playerCount; i++) {
    const battleCaseDrops = battle.drops[i];
    const parsedBattleDrops = [];
    for (const IDs of battleCaseDrops) {
      const parsedItems = [];
      for (const id of IDs) {
        const itemData = await db.caseDrop.findUnique({
          where: {
            id: id
          },
          include: {
            globalInvItem: true
          }
        });
        if (itemData) parsedItems.push(itemData);
      }
      parsedBattleDrops.push(parsedItems);
    }
    parsedBattle.drops[i] = parsedBattleDrops;
  }
  return parsedBattle;
}
