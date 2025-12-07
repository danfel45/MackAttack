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


interface TodaysGame{
  id: number,
  homeTeam: string,
  homeTeamLogo: string,
  homeTeamScore: number,
  awayTeam: string,
  awayTeamLogo: string,
  awayTeamScore: number,

}


interface TeamRecord{

  wins: number,
  losses: number,
  otLosses: number,
  points: number,
}

const sharksColors = {

  teal: "#006E7F",
  black: "#000000ff",
  orange: "#F58311",
  white: "#FFFF",

}


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

function LiveGameRow({game}: {game: TodaysGame}){

  return(

    
    <View key={game.id} style = {styles.liveGameLayout}>
      
      <SvgUri uri = {game.awayTeamLogo} width={120} height={120}/>
      <Text style = {{fontSize: 50, color: 'white'}}> {game.awayTeamScore}-{game.homeTeamScore}</Text>
      <SvgUri uri = {game.homeTeamLogo} width={120} height={120}/>

    </View>


  );
}

function TodaysGame({games}:{games:TodaysGame[]}){
  if(games.length <= 0) return;
  
  return(
      <View>
            <Text style = {styles.heading1}>Todays Game</Text>

          <View style = {styles.block2}>
            
            {games.map((game) => (
              
              <LiveGameRow key={game.id} game={game}/>
              

            ))}

          </View>

          </View>


);

}


export default function Index() {
  
  const [players, setPlayers] = useState<Player[]>([]);
  
  const [games, setGames] = useState<NextSharksGames[]>([]);
  
  const [teamRecords, setRecords] = useState<TeamRecordMap>({});
  
  const [todaysGames, setTodaysGames] = useState<TodaysGame[]>([]);
  
  useEffect(() => {
    //fetch data for the top ten point scorers in the NHL as of the current moment
    fetchPointScorers();
    //fetch data for the sharks next 7 days of games as of the current moment
    fetchSharksWeekSchedule();
    //fetch data for the NHL standings as of the current moment
    fetchStandings();
    //fetch data from todays games accross the NHL at the current moment
    fetchTodaysGames();
    
  },[])
  
  const formatRecord = (abbrev: TeamAbbrev) => {
  
    const rec = teamRecords[abbrev];
    if(!rec) return "t";
  
    return `${rec.wins}-${rec.losses}-${rec.otLosses}`;
  
  };
  
  function ThisWeeksSharksGames({games}:{games:NextSharksGames[]}){
  
    return(
  
        <View>
        
          <Text style = {styles.heading1}>Upcoming Games</Text>
          <View style = {styles.block1}>
  
          {games.map((game) =>(
  
            
  
            <View key={game.id}
              style = {{
                justifyContent: 'center', flexDirection: 'row', alignItems: 'center', 
  
              }}
            >
              
              <View style = {{alignContent: 'center'}}>
                  <SvgUri uri={game.awayTeamLogo} width={100} height={100}/>
                  <Text style = {styles.teamRecord}>{formatRecord(game.awayTeamAbbrev)}</Text>
  
  
              </View>
  
              
              <View style = {{alignItems: 'center'}}>
                  <Text style = {styles.date}> {game.date}</Text>
                  <Text style = {{fontSize: 50}}> - </Text>
  
              </View>
              
  
              <View style = {{alignContent: 'center'}}>
                  <SvgUri uri={game.homeTeamLogo} width={100} height={100}/>
                  <Text style = {styles.teamRecord}>{formatRecord(game.homeTeamAbbrev)}</Text>
  
  
              </View>
            </View>
  
               
            
          ))}
        
        </View></View>
  
    );
  }

  const fetchSharksWeekSchedule = async () => {

    try{

      const result = await fetch(
        "https://api-web.nhle.com/v1/club-schedule/SJS/week/now"
      );

      const weekSchedData = await result.json();
      
      
      const mappedGames: NextSharksGames[] = weekSchedData.games.map((g: any) => ({

        id: g.id,
        homeTeam: g.homeTeam.commonName.default,
        homeTeamAbbrev: g.homeTeam.abbrev as TeamAbbrev,
        homeTeamLogo: g.homeTeam.darkLogo,
        awayTeam: g.awayTeam.commonName.default,
        awayTeamAbbrev: g.awayTeam.abbrev as TeamAbbrev,
        awayTeamLogo: g.awayTeam.darkLogo,
        startTime: g.startTimeUTC,
        date: g.gameDate,

      }));

      setGames(mappedGames);


    }catch(e){
      console.log(e);
    }

  }

  const fetchStandings = async () => {
      try{
          const res = await fetch("https://api-web.nhle.com/v1/standings/now");
          const data = await res.json();

          const records: TeamRecordMap = {};

          data.standings.forEach((t: any) => {
            const abbrev = t.teamAbbrev.default as TeamAbbrev;

            records[abbrev] = {

              wins: t.wins,
              losses: t.losses,
              otLosses: t.otLosses,
              points: t.points,
            }

          });

          setRecords(records);
      }catch(e){console.log(e)}


  }

  const fetchTodaysGames = async () => {
    try{
      const result = await fetch("https://api-web.nhle.com/v1/score/now");
      const data = await result.json();

      const mappedTodaysGames = data.games.filter(
        (t: any) => t.homeTeam.abbrev === "SJS" || t.awayTeam.abbrev === "SJS"
      ).map((t: any) => ({
          
        id: t.id,
        homeTeam: t.homeTeam.name.default,
        homeTeamLogo: t.homeTeam.logo,
        homeTeamScore: t.homeTeam.score,
        awayTeam: t.awayTeam.name.default,
        awayTeamLogo: t.awayTeam.logo,
        awayTeamScore: t.awayTeam.score,


      }));

      setTodaysGames(mappedTodaysGames);

    } catch(e){
      console.log(e);
    }


  }

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
      

      
        {sharksGameToday ? (
          

          <TodaysGame games = {todaysGames}/>


        ) : (

          <ThisWeeksSharksGames games={games}/>
        
        
        )}




      
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
