using GTANetworkAPI;

namespace GrandRP
{
	
	public class DbPlayer
    {
		public int Id { get; set; }
		public Player Player { get; set; }
		public string Username { get; set; }
		public string Email { get; set; }
		public string Password { get; set; }
		public string IP { get; set; }
		public string HardwareID { get; set; }
		public string SocialClubName { get; set; }
		public string PromoCode { get; set; }
		public int Money { get; set; }
		public int Bank { get; set; }
		public int GrandCoins { get; set; }
		public int GrandPoints { get; set; }
		public int IsNew { get; set; }
		public int AdminRank { get; set; }
		public Vector3 Position { get; set; }
	}
}
