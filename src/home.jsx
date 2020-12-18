import Mygame from './my_game';
import Game from './index.jsx';
import StandAloneGame from './stand_alone_game';
function Home(props) {
  return (
    <div className='home-box'>
      <Game/>
      <Mygame/>
      <StandAloneGame/>
    </div>
  )
}
export default Home;