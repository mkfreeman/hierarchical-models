import './App.css';
import ScatterPlotComponent from './ScatterPlotComponent';
import * as d3 from 'd3';

var React = require('react');
var ReactDOM = require('react-dom');
var Scroll = require('react-scroll');

var Link = Scroll.Link;
var DirectLink = Scroll.DirectLink;
var Element = Scroll.Element;
var Events = Scroll.Events;
var scroll = Scroll.animateScroll;
var scrollSpy = Scroll.scrollSpy;

var durationFn = function(deltaTop) {
    return deltaTop;
};

const allData = [
    [{
        x: 10,
        y: 1000,
        id: "a"
    }, {
        x: 100,
        y: 100,
        id: "b"
    }, {
        x: 50,
        y: 10,
        id: "c"
    }],
    [{
        x: 10,
        y: 1000,
        id: "a"
    }, {
        x: 10,
        y: 1000,
        id: "b"
    }, {
        x: 5,
        y: 1200,
        id: "c"
    }], [{
        x: 100,
        y: 1000,
        id: "a"
    }, {
        x: 10,
        y: 10000,
        id: "b"
    }, {
        x: 50,
        y: 100,
        id: "c"
    }]
]
class App extends React.Component {

    constructor(props) {
        super(props);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.state = {
            dataStep: 1,
            allData: [],
            colorScale: d3.scaleOrdinal().range(d3.schemeCategory10)
        }
    }

    componentDidMount() {
        Events.scrollEvent.register('begin', function() {
            console.log("begin", arguments);
        });

        Events.scrollEvent.register('end', function() {
            console.log("end", arguments);
        });

        scrollSpy.update();
        d3.csv('data/faculty-data.csv', function(error, data) {
            console.log('data! ', data);
            // let formatted = data.map((d) => {{id:d.id, x:d.experience, y:d.salary})
            let formatted = data.map(function(d) {
                return {
                    id: d.id,
                    x: d.experience,
                    y: d.salary,
                    color: d.department
                }
            })
            this.setState({
                allData: [formatted, formatted, formatted]
            });
        }.bind(this))
    }
    scrollToTop() {
        scroll.scrollToTop();
    }
    componentWillUnmount() {
        Events.scrollEvent.remove('begin');
        Events.scrollEvent.remove('end');
    }
    handleSetActive(to) {
        this.setState({
            dataStep: Number(to.replace('test', ''))
        })
    }
    // formatData() {

    // }
    render() {
        console.log('state ', this.state)
        return (
            <div>
              <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container-fluid">
                  <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul className="nav navbar-nav">
                      <li>
                        <Link activeClass="active" onSetActive={ this.handleSetActive.bind(this) } className="test1" to="test1" spy={ true } smooth={ true } duration={ 500 }>Test 1</Link>
                      </li>
                      <li>
                        <Link activeClass="active" onSetActive={ this.handleSetActive.bind(this) } className="test2" to="test2" spy={ true } smooth={ true } duration={ 500 }>Test 2</Link>
                      </li>
                      <li>
                        <Link activeClass="active" onSetActive={ this.handleSetActive.bind(this) } className="test3" to="test3" spy={ true } smooth={ true } duration={ 500 }>Test 3</Link>
                      </li>
                      <li>
                        <Link activeClass="active" onSetActive={ this.handleSetActive.bind(this) } className="test4" to="test4" spy={ true } smooth={ true } duration={ 500 }>Test 4</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
              <ScatterPlotComponent colorScale={ (d) => this.state.colorScale(d.color) } data={ this.state.allData[this.state.dataStep] } xTitle="Years of Experience" yTitle="Salary" />
              <Element name="test1" className="element">
              </Element>
              <Element name="test2" className="element">
                test 2
              </Element>
              <Element name="test3" className="element">
                test 3
              </Element>
              <Element name="test4" className="element">
                test 4
              </Element>
            </div>
            );
    }
}
;

export default App;