using System;
using GTANetworkAPI;

namespace GrandRP
{
    public class Main : Script
    {
        public void LoadModules()
        {
            ChatModule.LoadCommands();
            ShopModule.LoadShops();
            System.SendConsoleMessage("");
            System.SendConsoleMessage("  =========================================================    ");
            System.SendConsoleMessage("     G R A N D     G A N G L I F E       S T A R T E D    ");
            System.SendConsoleMessage("  =========================================================    ");
            System.SendConsoleMessage("");
        }
        [ServerEvent(Event.ResourceStart)]
        public void OnResourceStartHandler()
        {
            LoadModules();
            SyncThread.Init();
            SyncThread.Instance.Start();
        }
}
}
