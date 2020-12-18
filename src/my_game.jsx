import React from 'react';
function Square(props) {
  return (
    <button 
        className="square" 
        onClick={props.onClick}
        style={props.winner ? {color: 'green'} : null}
      >
        {
          props.value ? 
          <div className={props.value === 'O' ? 'chess'  :'chess black-chess'} style={props.winner ? {backgroundColor: 'green'} : null}></div>
          :
          null
        }
      </button>
  )
}
class Board extends React.Component {
  renderSquare(i) {
    let winner = false;
    if(this.props.winnerArray){
      if(this.props.winnerArray[0] === i || this.props.winnerArray[1] === i || this.props.winnerArray[2] === i){
        winner = true;
      }
    }
    return (
      <Square 
        value={this.props.squares[i]}
        winner={winner}
        key={i}
        onClick={() => {this.props.onClick(i)}}
      />
    );
  }

  group(arr, subGroupLength) {
    let index = 0;
    const newArray = [];
    while(index < arr.length) {
      newArray.push(arr.slice(index, index += subGroupLength))
    }
    return newArray
  }

  mapRenderSquare(arr, index) {
    let newArray = [];
    newArray = arr.map((item, indexs) => {
      return this.renderSquare(indexs + (index * 3))
    })
    return newArray;
  }

  render() {

    return (
      <div>
        {
          this.group(this.props.squares, 3).map((item, index) => {
            return  <div className="board-row" key={index + 'row'} >
                      {this.mapRenderSquare(item, index)}
                    </div>;
          })
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        index: [0,0],
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrDescending: true,
      whiteRegret: 1,
      blackRegret: 1,
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const index = current.index.slice();
    index[0] = parseInt((i)/3);
    index[1] = parseInt(i%3);
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        index,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  ascendingOrDescending() {
    this.setState(
      {
        ascendingOrDescending: !this.state.ascendingOrDescending,
      }
    )
  }
  regretClick() {
    if(!this.state.xIsNext) {
      if(this.state.blackRegret === 0) {
        alert('没机会了^_^')
        return;
      }
      let history = this.state.history;
      history.pop()
      this.setState({
        history: history,
        xIsNext: !this.state.xIsNext,
        stepNumber: this.state.stepNumber - 1,
        blackRegret:  this.state.blackRegret - 1,
      })
    } else {
      if(this.state.whiteRegret === 0) {
        alert('没机会了^_^')
        return;
      }
      let history = this.state.history;
      history.pop()
      this.setState({
        history: history,
        xIsNext: !this.state.xIsNext,
        stepNumber: this.state.stepNumber - 1,
        whiteRegret:  this.state.whiteRegret - 1,
      })
    }
  }
  resetClick() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
        index: [0,0],
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrDescending: true,
      whiteRegret: 1,
      blackRegret: 1,
    })
  }
  render() {
    const history = this.state.history;
    const {whiteRegret, blackRegret} = this.state;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const isNull = current.squares.includes(null); // 判断是否最后一步
    let status;
    if (winner) {
      status = '赢家: ' + (winner.winner === 'O' ? '白棋' : '黑棋');
    }else if (!isNull) {
      status = '平局';
    } else {
      status = '出棋玩家: ' + (this.state.xIsNext ? '黑棋' : '白棋');
    }
    return (
      <div className="game">
        <div className="game-board">
          <div className="game-board-title">
             {status}
             <div className="game-board-title-record">
                <div>{'白悔棋：' + whiteRegret}</div>
                <div>{'黑悔棋：' + blackRegret}</div>
             </div>
             <div className="game-board-title-record">
                <button onClick={() => {this.regretClick()}}>
                  悔棋
                </button>
                <button onClick={() => {this.resetClick()}}>
                  重置
                </button>
             </div>
          </div>
          <Board 
            squares={current.squares}
            winnerArray={winner?.lines}
            onClick={(i) => {this.handleClick(i)}}
          />
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        lines: lines[i]
      };
    }
  }
  return null;
}
export default Game;