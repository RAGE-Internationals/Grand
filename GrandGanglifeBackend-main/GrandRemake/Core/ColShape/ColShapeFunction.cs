using GTANetworkAPI;
using System;

namespace GrandRP
{
    internal class ColShapeFunction
    {
        public string Name { get; set; }
        public object[] Arguments { get; set; }
        public Action<Player, object[]> Function { get; set; }

        public ColShapeFunction(string name, object[] args, Action<Player, object[]> action)
        {
            this.Name = name;
            this.Arguments = args;
            this.Function = action;
        }
    }
}
