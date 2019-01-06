import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
    return (
        <button
            className={`square ${props.highlight ? 'highlight' : ''}`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square key={i} value={this.props.squares[i]}
            onClick={() => this.props.handleClick(i)}
            highlight={this.props.winnerLine.includes(i)}
        />;
    }

    render() {
        const row_size = 3;
        const col_size = 3;
        let board_row = [];
        let board = [];
        for (let row = 0; row < row_size; row++) {
            board_row = [];
            for (let col = 0; col < col_size; col++) {
                let i = col + row * row_size;
                board_row.push(this.renderSquare(i));
            }
            board.push(
                <div className="board_row" key={row}>{board_row}</div>
            )
        }
        return (
            <div>{board}</div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    col: null,
                    row: null
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            acsending: true
        };
        this.handleClick = this.handleClick.bind(this); //コンストラクタ内でbindすることで受け渡し
    }
    handleClick(i) {
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
                col: i % 3,
                row: Math.floor(i / 3)
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length //追加
        });
    }

    //追加
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) ? false : true,
        });
    }

    toggle_sort() {
        this.setState({
            acsending: !this.state.acsending
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];//変更
        const winner = calculateWinner(current.squares);
        const winnerLine = winner ? winner.causedWin : [];
        const order = this.state.acsending ? 'decs' : 'asc';

        let status;
        if (winner) {
            status = 'Winner: ' + winner.win;
        } else if (this.state.stepNumber === 9 && winner === null) {
            status = 'Draw';
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        //追加
        const moves = history.map((step, move) => {
            const desc = move ?
                'Move #' + move + `(${step.col},${step.row})` :
                'Game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} className={this.state.stepNumber === move ? "bold" : ""} >{desc}</button>
                </li>
            );
        });

        return (
            <div className="game" >
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        handleClick={this.handleClick}
                        onClick={(i) => this.handleClick(i)}
                        winnerLine={winnerLine}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div><button onClick={() => this.toggle_sort()}>{order}</button></div>
                    <ol>{this.state.acsending ? moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

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
            return { win: squares[a], causedWin: lines[i] };
        }
    }
    return null;
}