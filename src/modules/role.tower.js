export let roleTower = {

    run: function() {
        let tower = Game.getObjectById('d52cc5ef658c0b5649e4efc3');
        if(tower) {
            let closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: (structure) => structure.hits < structure.hitsMax
            });
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(closestHostile) {
                tower.attack(closestHostile);
            }
        }
    },

}