import './App.css';
import ScatterPlotComponent from './ScatterPlotComponent';
import * as d3 from 'd3';
import Sections from './Sections';

var React = require('react');
var ReactDOM = require('react-dom');
var Scroll = require('react-scroll');


// Scrolling
var Link = Scroll.Link;
var DirectLink = Scroll.DirectLink;
var Element = Scroll.Element;
var Events = Scroll.Events;
var scroll = Scroll.animateScroll;
var scrollSpy = Scroll.scrollSpy;

var durationFn = function(deltaTop) {
    return deltaTop;
};

class App extends React.Component {

    constructor(props) {
        super(props);
        this.scrollToTop = this.scrollToTop.bind(this);
        this.state = {
            dataStep: 0,
            allData: [],
            allLineData: [],
            scatterSettings: [
                {
                    pack: true
                },
                {
                    pack: false
                },
                {
                    pack: false
                },
                {
                    pack: false
                }
            ],
            colorScales: [d3.scaleOrdinal().range(d3.schemeCategory10),
                d3.scaleOrdinal().range(d3.schemeCategory10),
                d3.scaleOrdinal().range(d3.schemeCategory10),
                d3.scaleOrdinal().range(d3.schemeCategory10),
                d3.scaleOrdinal().range(d3.schemeCategory10)]
        }
    }

    componentDidMount() {
        Events.scrollEvent.register('begin', function() {
            // console.log("begin", arguments);
        });

        Events.scrollEvent.register('end', function() {
            // console.log("end", arguments);
        });

        scrollSpy.update();
        d3.csv('data/faculty-data.csv', function(error, data) {
            // let formatted = data.map((d) => {{id:d.id, x:d.experience, y:d.salary})
            let formatted = data.map(function(d) {
                return {
                    id: d.ids,
                    x: d.experience,
                    y: d.salary,
                    color: d.department
                }
            })

            // Function to grab column of interest
            let GetLineData = function(col) {
                return data.map(function(d) {
                    return {
                        x: d.experience,
                        y: d[col],
                        color: d.department
                    }
                })
            }
            // Function to nest
            let lineNest = d3.nest()
                .key((d) => d.color);

            let randomSlopes = lineNest.entries(GetLineData('random.slope.preds'));
            let randomIntercept = lineNest.entries(GetLineData('random.intercpet.preds'));
            let randomSlopeIntercept = lineNest.entries(GetLineData('random.slope.int.preds'));
            let simpleModel = lineNest.entries(GetLineData('simple.model'))
            this.setState({
                allData: [formatted, formatted, formatted, formatted],
                allLineData: [[], [], simpleModel, randomSlopes, randomIntercept, randomSlopeIntercept]
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
        let colorScale = this.state.colorScales[this.state.dataStep];
        let chartData = this.state.allData[this.state.dataStep];
        let lineData = this.state.allLineData[this.state.dataStep];
        let scatterSettings = this.state.scatterSettings[this.state.dataStep];
        return (
            <div>
              <div className="container">
                <nav className="navbar navbar-default navbar-fixed-top">
                  <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                      <ul className="nav navbar-nav">
                        <li>
                          <Link activeClass="active" onSetActive={ this.handleSetActive.bind(this) } className="test0" to="test0" spy={ true } smooth={ true } duration={ 500 }>Test 0</Link>
                        </li>
                        <li>
                          <Link activeClass="active" onSetActive={ this.handleSetActive.bind(this) } className="test1" to="test1" spy={ true } smooth={ true } duration={ 500 }>Test 1</Link>
                        </li>
                        <li>
                          <Link activeClass="active" onSetActive={ this.handleSetActive.bind(this) } className="test2" to="test2" spy={ true } smooth={ true } duration={ 500 }>Test 2</Link>
                        </li>
                        <li>
                          <Link activeClass="active" onSetActive={ this.handleSetActive.bind(this) } className="test3" to="test3" spy={ true } smooth={ true } duration={ 500 }>Test 3</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
              <div className="container">
                <ScatterPlotComponent settings={ scatterSettings } lineData={ lineData } colorScale={ colorScale } data={ chartData } xTitle="Years of Experience"
                  yTitle="Salary" />
                <Element name="test0" className="element">
                  <Sections sectionNumber={ 0 } />
                </Element>
                <Element name="test1" className="element">
                  <Sections sectionNumber={ 1 } />
                </Element>
                <Element name="test2" className="element">
                  <Sections sectionNumber={ 2 } />
                </Element>
                <Element name="test3" className="element">
                  test 3
                </Element>
              </div>
            </div>
            );
    }
}
;

export default App;