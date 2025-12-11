import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SvgUri } from "react-native-svg";

interface Player{
  id: number;
  firstName: string;
  lastName: string;
  team: TeamAbbrev;
  points: number;
  headshot: string;
  teamLogo: string;
}


interface NextSharksGames{
  id: number,
  homeTeam: string,
  homeTeamLogo: string,
  homeTeamAbbrev: TeamAbbrev;
  awayTeam: string,
  awayTeamLogo: string,
  awayTeamAbbrev: TeamAbbrev,
  startTime: string,
  date: string,

}

type SharksSched = {



}


interface TodaysGame{
  id: number,
  homeTeam: string,
  homeTeamLogo: string,
  homeTeamScore: number,
  homeTeamRecord: string,
  awayTeam: string,
  awayTeamLogo: string,
  awayTeamScore: number,
  awayTeamRecord: string,
  currentPeriod: number,
  timeLeft: number,
  inIntermission: boolean,
  gameState: string,
  venue: string,
  startTime: string,

}

//Prop from the TodaysGame interface
type LiveGameProp = {

  game: TodaysGame;

}


interface TeamRecord{

  wins: number,
  losses: number,
  otLosses: number,
  points: number,
}

//Set of all SJS colors
const sharksColors = {

  teal: "#006E7F",
  black: "#000000ff",
  orange: "#F58311",
  white: "#FFFF",

}

//Set of team primary colors in NHL
const teamColor = {
  ANA: "#F47A38", // Ducks
  UTA: "#9ADBE8", // Mammoth
  BOS: "#FFB81C", // Bruins
  BUF: "#003087", // Sabres
  CAR: "#CC0000", // Hurricanes
  CBJ: "#002654", // Blue Jackets
  CGY: "#C8102E", // Flames
  CHI: "#CF0A2C", // Blackhawks
  COL: "#6F263D", // Avalanche
  DAL: "#006847", // Stars
  DET: "#CE1126", // Red Wings
  EDM: "#FF4C00", // Oilers
  FLA: "#041E42", // Panthers
  LAK: "#111111", // Kings
  MIN: "#154734", // Wild
  MTL: "#AF1E2D", // Canadiens
  NJD: "#CE1126", // Devils
  NSH: "#FFB81C", // Predators
  NYI: "#00539B", // Islanders
  NYR: "#0038A8", // Rangers
  OTT: "#C52032", // Senators
  PHI: "#F74902", // Flyers
  PIT: "#FFB81C", // Penguins
  SEA: "#001628", // Kraken
  SJS: "#006D75", // Sharks
  STL: "#002F87", // Blues
  TBL: "#002868", // Lightning
  TOR: "#00205B", // Maple Leafs
  VAN: "#00205B", // Canucks
  VGK: "#B4975A", // Golden Knights
  WPG: "#041E42", // Jets
  WSH: "#041E42", // Capitals

} as const;

type TeamAbbrev = keyof typeof teamColor;

type TeamRecordMap = Partial<Record<TeamAbbrev, TeamRecord>>;



//UI Component displaying point leaders in NHL
function PlayerComp({player}: {player: Player}){

 
    const isTargetPlayer = player.id === 8484801;

    return(

      <View key={player.id} 
      style = {{alignItems:"center"}}
      > 
        <View style = {{flexDirection: "row", alignItems: "center"}}>
        <SvgUri uri={player.teamLogo} width={40} height={40} />
        
        <Text style = {isTargetPlayer ? styles.mackName : styles.name}>
          {player.firstName} {player.lastName} - {player.points} 

        </Text>
      

        </View>
      
      
      </View>
    );


}





  






export default function ArtRoss() {
  
  const [players, setPlayers] = useState<Player[]>([]);
  
  const [games, setGames] = useState<NextSharksGames[]>([]);
  
  const [teamRecords, setRecords] = useState<TeamRecordMap>({});
  
  const [todaysGames, setTodaysGames] = useState<TodaysGame[]>([]);
  
  useEffect(() => {
    //fetch data for the top ten point scorers in the NHL as of the current moment
    fetchPointScorers();
    

    
    
  },[])
  
  

  
  

  

  const fetchPointScorers = async () => {

    try{
      const result = await fetch(
        "https://api-web.nhle.com/v1/skater-stats-leaders/20252026/2?categories=points&limit=10"
      );

      const data = await result.json();
      
      const mappedPlayers: Player[] = data.points.map((p: any) => ({
        id: p.id,
        firstName: p.firstName.default,
        lastName: p.lastName.default,
        team: p.teamAbbrev,
        points: p.value,
        headshot: p.headshot,
        teamLogo: p.teamLogo,


      }));
      
      setPlayers(mappedPlayers);

    } catch(e) {
      console.log(e);
    }
  }


  const sharksGameToday = todaysGames.length > 0;

  


  return (
    

    <ScrollView
     contentContainerStyle = {{gap: 20, padding:30}}
     style = {{backgroundColor: sharksColors.black}}
    >
    
      <Text style = {styles.heading2}>Macklin Art Ross Watch</Text>

      <View style = {styles.block1}>
    
          {players.map(player => (

            <PlayerComp key={player.id} player={player}/>
          ))}

         </View> 

      

      
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  name:{
    fontSize:18,
    fontWeight: "bold",
    color: sharksColors.white
  },

  mackName:{
    fontSize:18,
    fontWeight: "bold",
    color: sharksColors.orange

  },

  value:{

    fontSize:20,
    fontWeight:"bold",
    color: sharksColors.white
  },

  date: {
    fontSize: 15,
    fontWeight: 'bold'

  },

  teamRecord:{
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: sharksColors.white,
    paddingBottom: 10,

  },

  heading1: {

    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
    color: sharksColors.white,
    

  },

  heading2: {

    fontSize: 22,
    fontWeight: '800',
    marginBottom: 0,
    textAlign: 'center',
    color: sharksColors.white,
    
    
    

  },

  block1: {

    borderWidth: 8,
    borderColor: sharksColors.white,
    backgroundColor: sharksColors.teal,
    padding: 5,
    borderRadius: 20,
    
    

  },

  block2: {
    
    borderWidth: 8,
    borderColor: sharksColors.white,
    backgroundColor: sharksColors.teal,
    borderRadius: 20,
    borderStyle:'solid'

  },

  liveGameLayout:{
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',

  },



  


});
