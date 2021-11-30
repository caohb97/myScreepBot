import { errorMapper } from './modules/errorMapper';
import { roleHarvester } from './modules/role.harvester';
import { roleUpgrader } from './modules/role.upgrader';
import { roleBuilder } from './modules/role.builder';
import { roleTower } from './modules/role.tower';
import { clearMemory } from './modules/clear.memory';

export const loop = errorMapper(() => {

    roleTower.run();

    clearMemory.creeps();

    roleHarvester.create();

    roleUpgrader.create();

    roleBuilder.create();


    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
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


