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
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrDescending: true,
      pattern: 'simple',
      whiteRegret: 1,
      blackRegret: 1,
    }
  }
  handleClick(i, b) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    }, () => {
      if (b) return;
      this.computerHandleClick();
    });
  }
  computerHandleClick() {
    // 计算出未点击的格子，并随机取一个
    const history = this.state.history;
    const arr = history[history.length-1]?.squares || [];
    const newArr = [];
    arr.forEach((item, index) => {
      if(!item) {
        newArr.push(index);
      }
    })
    const i = Math.floor(Math.random()* (newArr.length));
    if (this.state.pattern === 'difficulty') {
      const iDifficulty = this.difficulty(arr);
      if (iDifficulty) {
        this.handleClick(iDifficulty, true);
        return;
      }
    }
    this.handleClick(newArr[i], true);
  }
  difficulty(squares) {
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
      if ((squares[a] && (squares[a] === squares[b])) 
      || (squares[b] && (squares[b] === squares[c])) 
      || (squares[c] && (squares[a] === squares[c]))
      ) {
        for (let is = 0; is < lines[i].length; is++) {
          if (!squares[lines[i][is]]) {
            return lines[i][is];
          };
        }
      }
    }
    return null;
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
      }],
      stepNumber: 0,
      xIsNext: true,
      ascendingOrDescending: true,
    })
  }
  patternClick(e) {
    this.setState({
      pattern: e.target.value,
    })
  }
  render() {
    const history = this.state.history;
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
            单机游戏
            <div>
              模式： 
              <select onChange={(e) => {this.patternClick(e)}}>
                <option value="simple">简单</option>
                <option value="difficulty">困难</option>
              </select>
            </div>
            <div>
              {status}
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