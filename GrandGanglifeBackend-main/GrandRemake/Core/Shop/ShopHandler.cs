using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using GTANetworkAPI;

namespace GrandRP
{
    public class ShopHandler : Script
    {

        [RemoteEvent("openShop")]
        public void openShop(Player c)
        {
            try
            {
                if (c == null) return;
                DbPlayer dbPlayer = c.GetPlayer();
                if (dbPlayer == null)
                    return;


                dbPlayer.Player.TriggerEvent("Client_OpenShop24", 0, dbPlayer.Money);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}
  