export let roleSpawn = {
    //如果正在产生creep，显示状态。
    display: function() {
        //spawning：如果该核心正在孵化一个新的creep，该属性将会包含一个StructureSpawn.Spawning对象，否则将为null。
        if(Game.spawns['Spawn1'].spawning) {
            let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
            //text(text, pos, [style])：绘制一个文本标签。
            Game.spawns['Spawn1'].room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                Game.spawns['Spawn1'].pos.x + 1,
                Game.spawns['Spawn1'].pos.y,
                {align: 'left', opacity: 0.8});
        }
    }
}