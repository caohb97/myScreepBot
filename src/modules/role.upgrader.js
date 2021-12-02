export let roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
            creep.memory.upgrading = true;
            creep.say('🚧 upgrade');
        }

        if(creep.memory.upgrading) {
            if( creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE ) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            let sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

    },

    create: function() {
        let upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        console.log('upgraders: ' + upgraders.length);

        if(upgraders.length < 2) {
            let newName = 'upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, 
                {memory: {role: 'upgrader'}});
            return true;
        }
        return false;

        if(Game.spawns['Spawn1'].spawning) {
            let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                {align: 'left', opacity: 0.8});
        }
    },
};
