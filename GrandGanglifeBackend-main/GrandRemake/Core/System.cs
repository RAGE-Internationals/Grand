using System;
using System.Collections.Generic;
using System.Text;

namespace GrandRP
{
    public static class System
    {
        public static void SendConsoleMessage(string message)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.Write("[GRAND] ");
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine($"{message}");
        }
    }
}
