export let roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //creep.store包含了creep所存储资源的对象；
        //getFreeCapacity返回该存储的剩余可用容量。
        if(creep.store.getFreeCapacity() > 0) {
            //creep.room指creep所在的房间；
            //find：查找房间中指定类型的所有对象；
            //FIND_SOURCES：FIND_*常量之一，代表所有source。
            //返回值sources是一个数组。
            let sources = creep.room.find(FIND_SOURCES);
            //creep.harvest：从 source 中采集能量或者从 mineral 或 deposit 中采集资源，输入参数为要采集的对象。
            //ERR_NOT_IN_RANGE：该函数返回的错误码之一，表示目标太远了。
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                //moveTo(x, y, [opts]) || moveTo(target, [opts])：在本房间内查询到目标的最佳路径并向目标移动。
                //visualizePathStyle：在 creep 的移动路线上画一条线。
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            //FIND_STRUCTURES：所有建筑。当需要寻找多种类型的建筑时，可以先寻找所有建筑，再有filter函数筛选。
            let targets = creep.room.find(FIND_STRUCTURES, {
                    //函数filter(structure)：对结果列表进行筛选。
                    filter: (structure) => {
                        //STRUCTURE_EXTENSION：即extension，填充能量从而允许建造更大型的creep。随着控制器等级的提升，可以建造更多。
                        //STRUCTURE_SPAWN：即spawn，可以创建、更新和回收 creeps 。
                        //STRUCTURE_TOWER：即tower，远程攻击creep，治疗creep，或维修建筑。房间里的任意对象都可以指定为它的目标。然而，效果线性地取决距离。每一个动作都会消耗能量。
                        //getFreeCapacity(resource)中的resource表示资源的类型。
                        return (structure.structureType == STRUCTURE_EXTENSION || 
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
            //structure.length代表数组targets的长度。
            if(targets.length > 0) {
                //transfer(target, resourceType, [amount])：将资源从该creep转移至其他对象。目标必须在紧邻creep的正方形区域中。
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },

    // 返回值来判断spawn是否有工作
    create: function() {
        //_.filter：筛选函数。
        //(creep) => creep.memory.role是一个箭头函数，输入creep名，返回creep.memory.role。
        let harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        //控制台显示creep.memory.role == 'harvester'的creep个数。
        console.log('Harvesters: ' + harvesters.length);
        //creep.memory.role == 'harvester'的creep个数小于2。
        if(harvesters.length < 2) {
            //Game.time：系统游戏 tick 计数。他在每个 tick 自动递增。
            let newName = 'harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            //spawnCreep(body, name, [opts])：启动creep孵化过程。所需的能量量可以从房间里的所有母巢spawn和扩展extension中提取出来。
            //memory：一个新creep的memory。如果提供，它将立即存储到Memory.creeps[name]。
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName, 
                {memory: {role: 'harvester'}});
            return true;
        }
        return false;
        
    },
};