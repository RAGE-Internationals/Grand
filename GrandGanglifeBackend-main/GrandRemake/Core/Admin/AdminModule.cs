using System;
using GrandRP;
using GTANetworkAPI;

namespace GrandRP.ServerEvents
{
    public class AdminModule : Script
    {
        [RemoteEvent("Server_OpenAdminCenter")]
        public void Server_OpenAdminCenter(Player player)
        {
            DbPlayer dbPlayer = player.GetPlayer();
            if (dbPlayer == null) return;
            if(dbPlayer.AdminRank > 0)
            {
                player.TriggerEvent("Client_OpenAdminCenter", "", "","","","","",dbPlayer.AdminRank,"");
            }
        }

        }

}
