using GTANetworkAPI;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace GrandRP
{
    class CommandObject
    {
        public string Name
        {
            get;
            set;
        }

        public int Permission
        {
            get;
            set;
        }

        public Action<DbPlayer, string[]> Callback
        {
            get;
            set;
        }

        public int Args
        {
            get;
            set;
        }
        public string ArgText
        {
            get;
            set;
        }



        public CommandObject(Action<DbPlayer, string[]> Callback, string Name, int Permission, int Args, string ArgText)
        {
            this.Name = Name;
            this.Permission = Permission;
            this.Callback = Callback;
            this.Args = Args;
            this.ArgText = ArgText;
        }


    }
}
