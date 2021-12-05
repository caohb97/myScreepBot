import { errorMapper } from './modules/errorMapper';
import { roleSpawn } from './modules/role.spawn';
import { roleHarvester } from './modules/role.harvester';
import { roleUpgrader } from './modules/role.upgrader';
import { roleBuilder } from './modules/role.builder';
import { roleTower } from './modules/role.tower';
import { roleMemory } from './modules/role.memory';

export const loop = errorMapper(() => {

    roleTower.run();

    roleMemory.cleanCreeps();

    // 保证创建顺序
    let isSpawn = false;
    if (! isSpawn) isSpawn = isSpawn || roleHarvester.create();
    if (! isSpawn) isSpawn = isSpawn || roleUpgrader.create();
    if (! isSpawn) isSpawn = isSpawn || roleBuilder.create();
    // 如果正在产生creep，显示状态。
    roleSpawn.display();
    
    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
})



