using System;
using System.Collections.Generic;
using System.Text;
using GTANetworkAPI;
using MySql.Data.MySqlClient;
using Newtonsoft.Json;

namespace GrandRP
{
    public static class LoadPlayerModule
    {

        public static DbPlayer GetPlayer(this Player player)
        {
            if ((Entity)(object)player == (Entity)null)
            {
                return null;
            }
            if (!((Entity)player).HasData("player"))
            {
                return null;
            }
            DbPlayer dbPlayer = ((Entity)player).GetData<DbPlayer>("player") as DbPlayer;
            return (dbPlayer != null) ? dbPlayer : null;
        }

        public static HeadOverlay CreateHeadOverlay(byte index, byte color, byte secondaryColor, float opacity)
        {
            HeadOverlay result = default(HeadOverlay);
            result.Index = index;
            result.Color = color;
            result.SecondaryColor = secondaryColor;
            result.Opacity = opacity;
            return result;
        }

        public static void SaveCustomization(CustomizeModel customizeModel, DbPlayer dbPlayer)
        {
            using (MySqlConnection mySqlConnection = new MySqlConnection(Database.connection))
            {
                try
                {
                    mySqlConnection.Open();

                    MySqlCommand mySqlCommand = mySqlConnection.CreateCommand();

                    mySqlCommand.CommandText = "UPDATE players SET Customization = @customization WHERE Id = @playerID";

                    mySqlCommand.Parameters.AddWithValue("@customization", JsonConvert.SerializeObject(customizeModel));
                    mySqlCommand.Parameters.AddWithValue("@playerID", dbPlayer.Id);
 

                    mySqlCommand.ExecuteNonQuery();

                    mySqlConnection.Close();

                }
                catch (Exception e)
                {
                    NAPI.Util.ConsoleOutput($"[EXCEPTION] RegisterUser: {e.Message}");
                    NAPI.Util.ConsoleOutput($"[EXCEPTION] RegisterUser: {e.StackTrace}");
                }
            }
        }


        public static void SaveClothing(clothobject clothes, DbPlayer dbPlayer)
        {
            using (MySqlConnection mySqlConnection = new MySqlConnection(Database.connection))
            {
                try
                {
                    mySqlConnection.Open();

                    MySqlCommand mySqlCommand = mySqlConnection.CreateCommand();

                    mySqlCommand.CommandText = "UPDATE players SET clothes = @clothes WHERE Id = @playerID";

                    mySqlCommand.Parameters.AddWithValue("@clothes", JsonConvert.SerializeObject(clothes));
                    mySqlCommand.Parameters.AddWithValue("@playerID", dbPlayer.Id);


                    mySqlCommand.ExecuteNonQuery();

                    mySqlConnection.Close();

                }
                catch (Exception e)
                {
                    NAPI.Util.ConsoleOutput($"[EXCEPTION] RegisterUser: {e.Message}");
                    NAPI.Util.ConsoleOutput($"[EXCEPTION] RegisterUser: {e.StackTrace}");
                }
            }
        }

        public static void SetClothes(this DbPlayer dbPlayer, int componentId, int drawableId, int textureId)
        {
            if (dbPlayer.Player == null) return;
            try
            {

                Player c = dbPlayer.Player;

                c.SetClothes(componentId, drawableId, textureId);

                c.Eval($"mp.events.callRemote('ChangeClothes', {componentId}, {drawableId}, {textureId});");

                /*Dictionary<int, clothingPart> clothes = new Dictionary<int, clothingPart>();

                if (c.HasSharedData("syncedClothes") && c.GetSharedData("syncedClothes") != null)
                {
                    clothes = NAPI.Util.FromJson<Dictionary<int, clothingPart>>(c.GetSharedData("syncedClothes"));
                }

                clothingPart clothing = new clothingPart();
                clothing.drawable = drawableId;
                clothing.texture = textureId;
                if (clothes.ContainsKey(componentId))
                {
                    clothes[componentId] = clothing;
                }
                else
                {
                    clothes.Add(componentId, clothing);
                }

                string syncedClothes = NAPI.Util.ToJson(clothes);
                c.SetSharedData("syncedClothes", syncedClothes);*/
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
        public static void LoadPlayer(Player p, string password)
        {
         try 
            { 

            if (p == null) return;

            using (MySqlConnection mySqlConnection = new MySqlConnection(Database.connection))
            {
                mySqlConnection.Open();

                MySqlCommand mySqlCommand = mySqlConnection.CreateCommand();

                mySqlCommand.CommandText = "SELECT * FROM players WHERE social=@social";

                mySqlCommand.Parameters.AddWithValue("@social", p.SocialClubName);

                using (MySqlDataReader mySqlDataReader = mySqlCommand.ExecuteReader())
                {
                    if (mySqlDataReader.HasRows)
                    {
                        mySqlDataReader.Read();
                            if (mySqlDataReader.GetString("password") != password)
                            {
                                p.TriggerEvent("Login_Error", "Dein Passwort stimmt nicht!");
                                return;
                            }
                            if (mySqlDataReader.GetString("username") != p.Name)
                            {
                                p.TriggerEvent("Login_Error", "Dein Benutzername Stimmt nicht mit deinem Socialclubnamen überein!");
                                return;
                            }

                            DbPlayer dbPlayer = new DbPlayer
                            {
                                Id = mySqlDataReader.GetInt32("id"),
                                Player = p,
                                Username = mySqlDataReader.GetString("username"),
                                Password = mySqlDataReader.GetString("password"),
                                Email = mySqlDataReader.GetString("email"),
                                Position = NAPI.Util.FromJson<Vector3>(mySqlDataReader.GetString("position")),
                                SocialClubName = mySqlDataReader.GetString("social"),
                                PromoCode = mySqlDataReader.GetString("promo"),
                                Money = mySqlDataReader.GetInt32("money"),
                                Bank = mySqlDataReader.GetInt32("bank"),
                                GrandCoins = mySqlDataReader.GetInt32("grandcoins"),
                                GrandPoints = mySqlDataReader.GetInt32("grandpoints"),
                                IsNew = mySqlDataReader.GetInt32("isnew"),
                                AdminRank = mySqlDataReader.GetInt32("adminlevel")
                            };
                            p.SetData("player", dbPlayer);
                            if(mySqlDataReader.GetString("clothes") != "")
                            {
                                clothobject Clothes = JsonConvert.DeserializeObject<clothobject>(mySqlDataReader.GetString("clothes"));
                                dbPlayer.SetClothes(11, Clothes.localshirts, 0);
                                dbPlayer.SetClothes(4, Clothes.localjeans, 0);
                                dbPlayer.SetClothes(6, Clothes.localboots, 0);
                            }

                            if (mySqlDataReader.GetString("Customization") != "")
                            {
                                CustomizeModel customizeModel =
                                     NAPI.Util.FromJson<CustomizeModel>(mySqlDataReader.GetString("Customization"));
                                /*  Dictionary<int, HeadOverlay> dictionary = new Dictionary<int, HeadOverlay>();
                                  if (customizeModel.customization.Appearance[9] != null)
                                      dictionary.Add(1,
                                          CreateHeadOverlay(
                                              (byte)customizeModel.customization.Appearance[1].Value,
                                              (byte)customizeModel.customization.Appearance[9].Value, 0,
                                              customizeModel.customization.Appearance[1].Opacity));
                                  dictionary.Add(2,
                                     CreateHeadOverlay(2,
                                          (byte)customizeModel.customization.Appearance[2].Value, 0,
                                          customizeModel.customization.Appearance[2].Opacity));
                                  dictionary.Add(3,
                                      CreateHeadOverlay(3,
                                          (byte)customizeModel.customization.Appearance[3].Value, 0,
                                          customizeModel.customization.Appearance[3].Opacity));
                                  dictionary.Add(4,
                                      CreateHeadOverlay(4,
                                          (byte)customizeModel.customization.Appearance[4].Value, 0,
                                          customizeModel.customization.Appearance[4].Opacity));
                                  dictionary.Add(5,
                                      CreateHeadOverlay(5,
                                          (byte)customizeModel.customization.Appearance[5].Value, 0,
                                          customizeModel.customization.Appearance[5].Opacity));
                                  dictionary.Add(8,
                                      CreateHeadOverlay(8,
                                          (byte)customizeModel.customization.Appearance[8].Value, 0,
                                          customizeModel.customization.Appearance[8].Opacity));
                                  HeadBlend val = default(HeadBlend);
                                  val.ShapeFirst = (byte)customizeModel.customization.Parents.mother;
                                  val.ShapeSecond = (byte)customizeModel.customization.Parents.father;
                                  val.ShapeThird = 0;
                                  val.SkinFirst = (byte)customizeModel.customization.Parents.mother;
                                  val.SkinSecond = (byte)customizeModel.customization.Parents.father;
                                  val.SkinThird = 0;
                                  val.ShapeMix = customizeModel.customization.Parents.similarity;
                                  val.SkinMix = customizeModel.customization.Parents.similarity;
                                  val.ThirdMix = 0f;
                                  bool flag = Convert.ToBoolean(customizeModel.customization.Gender);
                                  HeadBlend val2 = val;
                                  List<Decoration> list = new List<Decoration>();
                                  p.SetCustomization(flag, val2, (byte)customizeModel.customization.EyeColor,
                                                  (byte)customizeModel.customization.Hair.Color,
                                                  (byte)customizeModel.customization.Hair.HighlightColor,
                                                  customizeModel.customization.Features.ToArray(), dictionary,
                                                  list.ToArray());*/

                                dbPlayer.SetClothes(2, customizeModel.customization.localhairstyle, 0);

                                HeadBlend hblend = new HeadBlend
                                {
                                    ShapeFirst = (byte)customizeModel.customization.Parents.mother,
                                    ShapeSecond = (byte)customizeModel.customization.Parents.father,
                                    ShapeThird = 0,
                                    SkinFirst = (byte)customizeModel.customization.Parents.mother,
                                    SkinSecond = (byte)customizeModel.customization.Parents.father,
                                    SkinThird = 0,
                                    ShapeMix = (float)customizeModel.customization.Parents.similarity,
                                    SkinMix = (float)customizeModel.customization.Parents.similarity,
                                    ThirdMix = 0
                                };

                                var headOverlays = new Dictionary<int, HeadOverlay> 
                                {
                                    {
                        1,
                        new HeadOverlay()
                        {
                            Index = (byte)customizeModel.customization.localbeard,
                            Opacity = (float)(100 * 0.1),
                            Color = (byte)customizeModel.customization.localhaircolor,
                            SecondaryColor = 0
                        }
                    },
                                                        {
                        8,
                        new HeadOverlay()
                        {
                            Index = (byte)customizeModel.customization.locallipstick,
                            Opacity = (float)(100 * 0.1),
                            Color = (byte)customizeModel.customization.locallipstickcolor,
                            SecondaryColor = (byte)customizeModel.customization.locallipstickcolor
                        }
                    },
                    {
                        9,
                        new HeadOverlay()
                        {
                            Index = (byte)customizeModel.customization.localmoles,
                            Opacity = (float)(100 * 0.1),
                            Color = 0,
                            SecondaryColor = 0
                        }
                    },
                    {
                        10,
                        new HeadOverlay()
                        {
                            Index = (byte)customizeModel.customization.localchesthair,
                            Opacity = (float)(100 * 0.1),
                            Color = (byte)customizeModel.customization.localhaircolor,
                            SecondaryColor = (byte)customizeModel.customization.localhaircolor
                        }
                    },
                                        {
                        2,
                        new HeadOverlay()
                        {
                            Index = (byte)customizeModel.customization.localeyebrows,
                            Opacity = (float)(100 * 0.1),
                            Color = (byte)customizeModel.customization.localeyecolor,
                            SecondaryColor = 0
                        }
                    },
                    {
                        4,
                        new HeadOverlay()
                        {
                            Index = (byte)customizeModel.customization.localmakeup,
                            Opacity = (float)(100 * 0.1),
                            Color = (byte)0
                            , SecondaryColor = 0
                        }
                    },
                    {
                        5,
                        new HeadOverlay()
                        {
                            Index = (byte)customizeModel.customization.localblush,
                            Opacity = (float)(100 * 0.1),
                            Color = (byte)customizeModel.customization.localblushcolor,
                            SecondaryColor = (byte)customizeModel.customization.localblushcolor
                        }
                    },
                                };
                              /*  var headOverlays = new Dictionary<int, HeadOverlay>
                {
                    {
                        0,
                        new HeadOverlay()
                        {
                            Index = (byte)customizeModel.customization.localb,
                            Opacity = (float)(playerCharacter.blemishes_visibility * 0.1),
                            Color = (byte)0,
                            SecondaryColor = 0
                        }
                    },
                    {
                        1,
                        new HeadOverlay()
                        {
                            Index = (byte)playerCharacter.beard,
                            Opacity = (float)(playerCharacter.beard_visibility * 0.1),
                            Color = (byte)playerCharacter.beard_color,
                            SecondaryColor = 0
                        }
                    },
                    {
                        2,
                        new HeadOverlay()
                        {
                            Index = (byte)playerCharacter.eyebrow,
                            Opacity = (float)(playerCharacter.eyebrow_width * 0.1),
                            Color = (byte)playerCharacter.eye_color,
                            SecondaryColor = 0
                        }
                    },
                    {
                        3,
                        new HeadOverlay()
                        {
                            Index = (byte)playerCharacter.ageing,
                            Opacity = (float)(playerCharacter.ageing_visibility * 0.1),
                            Color = (byte)0,
                            SecondaryColor = 0
                        }
                    },
                    {
                        4,
                        new HeadOverlay()
                        {
                            Index = (byte)playerCharacter.makeup,
                            Opacity = (float)(playerCharacter.makeup_visibility * 0.1),
                            Color = (byte)playerCharacter.makeup_color
                            , SecondaryColor = 0
                        }
                    },
                    {
                        5,
                        new HeadOverlay()
                        {
                            Index = (byte)playerCharacter.blush,
                            Opacity = (float)(playerCharacter.blush_strength * 0.1),
                            Color = (byte)0,
                            SecondaryColor = 0
                        }
                    },
                    {
                        7,
                        new HeadOverlay()
                        {
                            Index = (byte)playerCharacter.sundamage,
                            Opacity = (float)(playerCharacter.sundamage_strength * 0.1),
                            Color = (byte)0,
                            SecondaryColor = 0
                        }
                    },
                    {
                        8,
                        new HeadOverlay()
                        {
                            Index = (byte)playerCharacter.lipstick,
                            Opacity = (float)(playerCharacter.lipstick_visibility * 0.1),
                            Color = (byte)playerCharacter.lipstick_color,
                            SecondaryColor = (byte)playerCharacter.lipstick_color_sec
                        }
                    },
                    {
                        9,
                        new HeadOverlay()
                        {
                            Index = (byte)playerCharacter.moles,
                            Opacity = (float)(playerCharacter.moles_strength * 0.1),
                            Color = 0,
                            SecondaryColor = 0
                        }
                    },
                    {
                        10,
                        new HeadOverlay()
                        {
                            Index = (byte)playerCharacter.chesthair,
                            Opacity = (float)(playerCharacter.chesthair_strength * 0.1),
                            Color = (byte)playerCharacter.chesthair_color,
                            SecondaryColor = (byte)playerCharacter.chesthair_color_sec
                        }
                    },
                    {
                        11,
                        new HeadOverlay()
                        {
                            Index = (byte)playerCharacter.bodyblemishes,
                            Opacity = (float)(playerCharacter.bodyblemishes_strenght * 0.1),
                            Color = 0,
                            SecondaryColor = 0
                        }
                    },
                };*/

                                var decorations = new List<Decoration>();
                                //Gender 1  == male // 0 == female
                                p.SetCustomization(Convert.ToBoolean(customizeModel.customization.Gender), hblend, (byte)customizeModel.customization.localeyecolor, (byte)customizeModel.customization.localhaircolor, (byte)customizeModel.customization.localhaircolor, new float[19], headOverlays, decorations.ToArray());

                                
                                p.SetFaceFeature(0, customizeModel.customization.zero);
                                p.SetFaceFeature(1, customizeModel.customization.one);
                                p.SetFaceFeature(2, customizeModel.customization.two);
                                p.SetFaceFeature(3, customizeModel.customization.three);
                                p.SetFaceFeature(4, customizeModel.customization.four);
                                p.SetFaceFeature(5, customizeModel.customization.five);
                                p.SetFaceFeature(6, customizeModel.customization.six);
                                p.SetFaceFeature(7, customizeModel.customization.seven);
                                p.SetFaceFeature(8, customizeModel.customization.eight);
                                p.SetFaceFeature(9, customizeModel.customization.nine);
                                p.SetFaceFeature(10, customizeModel.customization.ten);
                                p.SetFaceFeature(11, customizeModel.customization.eleven);
                                p.SetFaceFeature(12, customizeModel.customization.twelve);
                                p.SetFaceFeature(13, customizeModel.customization.thirteen);
                                p.SetFaceFeature(14, customizeModel.customization.fourteen);
                                p.SetFaceFeature(15, customizeModel.customization.fifteen);
                                p.SetFaceFeature(16, customizeModel.customization.sixteen);
                                p.SetFaceFeature(17, customizeModel.customization.seventeen);
                                p.SetFaceFeature(18, customizeModel.customization.eightteen);
                                p.SetFaceFeature(19, customizeModel.customization.nineteen);
                            }
                   }
                }
            }

                DbPlayer player = p.GetPlayer();
                if (player == null)
                {
                    Console.WriteLine("Null - DbPlayer");
                }
                if (player.IsNew == 1)
                {
                    player.Player.Position = new Vector3(-811.6229, 175.19739, 76.745476);
                    player.Player.Rotation = new Vector3(0, 0, 113.72107);
                    player.Player.Dimension = (uint)player.Id;
                    player.Player.TriggerEvent("CreateChar");
                    player.Player.SetSharedData("PlayerId", player.Id);
                    player.Player.TriggerEvent("LoginClose", 0);
                }
                else
                {
                    player.Player.TriggerEvent("Client_ShowNotification", "Du hast dich erfolgreich angemeldet!", 25);
                    player.Player.TriggerEvent("LoadHud", player.Id, player.Money, player.Bank, DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Month, DateTime.Now.Day, DateTime.Now.Year);
                    player.Player.SetSharedData("PlayerId", player.Id);
                    player.Player.Position = player.Position;
                    player.Player.SetSharedData("InLogin", false);
                    player.Player.TriggerEvent("LoginClose", 1);
                }



            }
            catch(Exception ex)
            {
                System.SendConsoleMessage(ex.ToString());
            }
        }
    }
}
