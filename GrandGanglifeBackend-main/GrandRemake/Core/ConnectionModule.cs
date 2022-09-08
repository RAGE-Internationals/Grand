using System;
using System.Collections.Generic;
using GrandRP;
using GTANetworkAPI;

namespace GrandRP.ServerEvents
{
    public class ConnectionModule : Script
    {




        [ServerEvent(Event.IncomingConnection)]
        public void OnIncomingConnection(string ip, string serial, string rgscName, ulong rgscId, GameTypes gameType, CancelEventArgs cancel)
        {
            ConnectionObject connection = new ConnectionObject()
            {
                IP = ip,
                HWID = serial,
                SocialClubName = rgscName
            };
            ChatModule.ConnectionList.Add(connection);
            //Console.WriteLine($"Ip: {ip}\nHwid: {serial}\nR* Name: {rgscName}\nR* Id: {rgscId}\nGameType: {gameType}\n");

        }
        
        [ServerEvent(Event.ResourceStart)]
        public void OnResourceStart()
        {
            System.SendConsoleMessage("Connection Module geladen.");
        }
        [ServerEvent(Event.PlayerConnected)]
        public static void OnPlayerConnected(Player player)
        {
            player.TriggerEvent("Client_Clear_Quene");
            player.SetSharedData("InLogin", true);
        }
    }

}
