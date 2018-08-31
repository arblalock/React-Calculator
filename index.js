const {render} = ReactDOM;
const {connect, Provider} = ReactRedux;
const {createStore, combineReducers} = Redux;

const APPEND = "APPEND";
const EQUALS = "EQUALS";
const CLEAR = "CLEAR";

const appSign = (sign) => ({type: APPEND, sign});
const clearCalc = () => ({type: CLEAR});
const equalCalc = (tot) => ({type: EQUALS, tot});

const initState = {
  currOp: "",
  currDsp: 0,
  resumeTot: false
}

const opers = "+-/*"

const evalReducer = (state = initState, action) => {
  switch (action.type) {
    case APPEND:
      let newOp;
      let newDsp;
      let resumeTot = false;
      if (opers.includes(action.sign) && opers.includes(state.currOp[state.currOp.length - 1])) {
        newOp = state.currOp.slice(0, -1) + action.sign;
        newDsp = action.sign;
      } else if (opers.includes(action.sign)) {
        //need to make sure it dones't start with an operation
        newOp = state.currDsp != 0
          ? state.currOp + action.sign
          : "";
        newDsp = state.currDsp != 0
          ? action.sign
          : 0;
      } else {
        if (state.resumeTot == true) {
          if (!opers.includes(action.sign)) {
            newOp = action.sign
            newDsp = action.sign
          }
        } else {
          newOp = action.sign == 0 && state.currDsp == 0
            ? ""
            : state.currOp + action.sign;
          newDsp = state.currDsp == 0 || opers.includes(state.currOp[state.currOp.length - 1])
            ? action.sign
            : state.currDsp + action.sign;
        }
      }
      return Object.assign({}, state, {
        currOp: newOp,
        currDsp: newDsp,
        resumeTot: resumeTot
      })
    case EQUALS:
      return Object.assign({}, state, {
        currOp: action.tot.toString(),
        currDsp: action.tot,
        resumeTot: true
      })
    case CLEAR:
      return Object.assign({}, state, initState)
    default:
      return state;
  }
}

store = createStore(evalReducer);

class Buttons extends React.Component {
  constructor(props) {
    super(props)
    this.hSign = this.hSign.bind(this)
    this.hClear = this.hClear.bind(this)
    this.hEquals = this.hEquals.bind(this)
  }

  hSign(e) {
    let sign = e.target.innerHTML == "x"
      ? "*"
      : e.target.innerHTML;
    if ((sign === "." && this.props.currDsp.includes(".")) || (this.props.currDsp.length > 14 && !opers.includes(sign))) {
      sign = null;
    }
    this.props.appSign(sign.toString())
  }
  hClear() {
    this.props.clearCalc();
  }
  hEquals() {
    let tot = eval(this.props.currOp);
    tot = tot > 999999999999999
      ? 999999999999999
      : tot
    tot = tot % 1 > 0
      ? tot.toFixed(2)
      : tot
    this.props.equalCalc(tot);
  }

  render() {
    return (<div className="btnCont subCont">
      <button id="clear" onClick={this.hClear} className="numbtn btn wide-btn">AC</button>
      <button id="divide" onClick={this.hSign} className="numbtn btn">/</button>
      <button id="multiply" onClick={this.hSign} className="numbtn btn">x</button>
      <button id="one" onClick={this.hSign} className="numbtn btn">1</button>
      <button id="two" onClick={this.hSign} className="numbtn btn">2</button>
      <button id="three" onClick={this.hSign} className="numbtn btn">3</button>
      <button id="subtract" onClick={this.hSign} className="numbtn btn">-</button>
      <button id="four" onClick={this.hSign} className="numbtn btn">4</button>
      <button id="five" onClick={this.hSign} className="numbtn btn">5</button>
      <button id="six" onClick={this.hSign} className="numbtn btn">6</button>
      <button id="add" onClick={this.hSign} className="numbtn btn">+</button>
      <button id="seven" onClick={this.hSign} className="numbtn  btn">7</button>
      <button id="eight" onClick={this.hSign} className="numbtn  btn">8</button>
      <button id="nine" onClick={this.hSign} className="numbtn  btn">9</button>
      <button id="zero" onClick={this.hSign} className="numbtn wide-btn btn">0</button>
      <button id="decimal" onClick={this.hSign} className="numbtn btn">.</button>
      <button id="equals" onClick={this.hEquals} className="numbtn high-btn btn">=</button>
    </div>)
  }
}

let Display = ({currDsp}) => {
  return (<div className="subCont">
    <div id="display" className="display">{currDsp}</div>
  </div>)
}

let Formula = ({currOp}) => {
  return (<div className="subCont">
    <div className="display form-disp">{currOp}</div>
  </div>)
}

MapDSPToProps = (state) => ({currDsp: state.currDsp});
MapOpToProps = (state) => ({currOp: state.currOp, currDsp: state.currDsp});
MapDispatchToProps = (dispatch) => ({
  appSign: (sign) => dispatch(appSign(sign)),
  clearCalc: () => dispatch(clearCalc()),
  equalCalc: (tot) => dispatch(equalCalc(tot))
});

Display = connect(MapDSPToProps)(Display);
Formula = connect(MapOpToProps)(Formula);
Buttons = connect(MapOpToProps, MapDispatchToProps)(Buttons);

const AppCont = () => (<div className="Ocont">
  <Formula/>
  <Display/>
  <Buttons/>
</div>)

class AppWrapper extends React.Component {
  render() {
    return (<Provider store={store}>
      <AppCont/>
    </Provider>)
  }
}

render(<AppWrapper/>, document.getElementById('app'))
