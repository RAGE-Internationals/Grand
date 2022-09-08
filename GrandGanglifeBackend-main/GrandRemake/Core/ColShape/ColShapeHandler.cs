using GTANetworkAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace GrandRP
{
    class ColShapeHandler : Script
    {
        [RemoteEvent("PressedKeyE")]
        public void PressedKeyE(Player c)
        {
            try {
            if (c == null) return;
            DbPlayer dbPlayer = c.GetPlayer();
            if (dbPlayer == null)
                return;

           

                ColShape val = NAPI.Pools.GetAllColShapes().FirstOrDefault((ColShape col) => col.IsPointWithin(c.Position));
                if (!(val != null) || (val.Dimension != uint.MaxValue) && (c.Dimension != val.Dimension))
                {
                    return;
                }
                FunctionModel functionModel = val.GetData<FunctionModel>("FUNCTION_MODEL");
                if (functionModel != null)
                {
                    if (functionModel.Arg1 != null && functionModel.Arg2 != null)
                    {
                        c.Eval("mp.events.callRemote('" + functionModel.Function + "', '" + functionModel.Arg1 + "', '" + functionModel.Arg2 + "');");
                    }
                    else if (functionModel.Arg2 == null && functionModel.Arg1 != null)
                    {
                        c.Eval("mp.events.callRemote('" + functionModel.Function + "', '" + functionModel.Arg1 + "');");
                    }
                    else
                    {
                        c.Eval("mp.events.callRemote('" + functionModel.Function + "');");
                    }

                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}
