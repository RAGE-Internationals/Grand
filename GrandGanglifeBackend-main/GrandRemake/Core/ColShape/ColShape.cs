using GTANetworkAPI;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrandRP
{
    internal static class ColShapeExtension
    {
        public static void SetFunction(this ColShape colShape, ColShapeFunction colShapeFunction) => colShape.SetData("COLSHAPE_FUNCTION", colShapeFunction);
        public static ColShapeFunction GetFunction(this ColShape colShape) => colShape.HasData("COLSHAPE_FUNCTION") ? colShape.GetData<ColShapeFunction>("COLSHAPE_FUNCTION") : null;
    }
}
