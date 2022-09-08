using GTANetworkAPI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace GrandRP
{
    public class Shop
    {
        public static List<Shop> Shops = new List<Shop>();
        public int Id { get; set; }
        public Vector3 Position { get; set; }

        public Shop() { }
    }
}
