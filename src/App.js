import './App.css';
import ScatterPlotComponent from './ScatterPlotComponent';
import * as d3 from 'd3';
import Sections from './Sections';
var ReactGA = require('react-ga');

function logPageView() {
    ReactGA.set({
        page: window.location.pathname + window.location.search
    });
    ReactGA.pageview(window.location.pathname + window.location.search);
}
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
        this.scrollToTop = this
            .scrollToTop
            .bind(this);
        this.state = {
            dataStep: 0,
            allData: [],
            allLineData: [],
            scatterSettings: [
                {
                    pack: false,
                    hideAxes: true
                }, {
                    pack: true,
                    hideAxes: true
                }, {
                    pack: false,
                    hideAxes: false
                }, {
                    pack: false,
                    hideAxes: false
                }, {
                    pack: false,
                    hideAxes: false
                }
            ],
            colorScales: [
                d3
                    .scaleOrdinal()
                    .range(d3.schemeCategory10),
                d3
                    .scaleOrdinal()
                    .range(d3.schemeCategory10),
                d3
                    .scaleOrdinal()
                    .range(d3.schemeCategory10),
                d3
                    .scaleOrdinal()
                    .range(d3.schemeCategory10),
                d3
                    .scaleOrdinal()
                    .range(d3.schemeCategory10),
                d3
                    .scaleOrdinal()
                    .range(d3.schemeCategory10)
            ]
        }
    }

    componentDidMount() {
        // Google analytics
        ReactGA.initialize('UA-49431863-5');
        logPageView();
        Events
            .scrollEvent
            .register('begin', function() {
                // console.log("begin", arguments);
            });

        Events
            .scrollEvent
            .register('end', function() {
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
            let random = data.map(function(d) {
                return {
                    id: d.ids,
                    x: Math.random(),
                    y: Math.random(),
                    color: d.department
                }
            });

            // Function to grab column of interest
            let GetLineData = function(col) {
                let allData = data.map(function(d) {
                    return {
                        x: +d.experience,
                        y: d[col],
                        color: d.department
                    }
                });

                // Function to nest
                let lineNest = d3
                    .nest()
                    .key((d) => d.color);

                // New function to get line data
                let nested = lineNest.entries(allData);

                nested.map(function(d) {
                    let xMin = d3.min(d.values, (d) => +d.x)
                    let xMax = d3.max(d.values, (d) => +d.x)
                    let ret = d
                        .values
                        .filter((d) => d.x == xMax | d.x == xMin)
                        .sort(function(a, b) {
                            return a.x - b.x
                        })
                    d.values = [
                        ret[0],
                        ret[ret.length - 1]
                    ]
                })
                return nested;
            }

            let randomSlopes = GetLineData('random.slope.preds');
            let randomIntercept = GetLineData('random.intercpet.preds');
            let randomSlopeIntercept = GetLineData('random.slope.int.preds');
            let simpleModel = GetLineData('simple.model');
            this.setState({
                allData: [
                    random, formatted, formatted, formatted, formatted, formatted
                ],
                allLineData: [
                    [],
                    [],
                    simpleModel,
                    randomIntercept,
                    randomSlopes,
                    randomSlopeIntercept
                ]
            });
        }.bind(this))
    }
    scrollToTop() {
        scroll.scrollToTop();
    }
    componentWillUnmount() {
        Events
            .scrollEvent
            .remove('begin');
        Events
            .scrollEvent
            .remove('end');
    }
    handleSetActive(to) {
        let dataStep = 0;
        switch (to) {
            case( 'intro'):
                dataStep = 0
                break;
            case( 'nested-data'):
                dataStep = 1
                break;
            case( 'linear'):
                dataStep = 2
                break;
            case( 'random-intercept'):
                dataStep = 3
                break;
            case( 'random-slope'):
                dataStep = 4
                break;
            case ( 'random-slope-intercept'):
                dataStep = 5;
                break;
        }
        this.setState({
            dataStep: dataStep
        })
    }
    render() {
        let colorScale = this.state.colorScales[this.state.dataStep];
        let chartData = this.state.allData[this.state.dataStep];
        let lineData = this.state.allLineData[this.state.dataStep];
        let scatterSettings = this.state.scatterSettings[this.state.dataStep];
        return (
            <div>
              <div className="container">
                <nav className="navbar navbar-default navbar-fixed-top">
                  <div className="container">
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                      <ul className="nav navbar-nav">
                        <li>
                          <Link activeClass="active" onSetActive={ this
                                                                       .handleSetActive
                                                                       .bind(this) } className="Intro" to="Intro" spy={ true } smooth={ true } duration={ 500 }>Intro</Link>
                        </li>
                        <li>
                          <Link activeClass="active" onSetActive={ this
                                                                       .handleSetActive
                                                                       .bind(this) } className="nested-data" to="nested-data" spy={ true } smooth={ true } duration={ 500 }>Nested Data</Link>
                        </li>
                        <li>
                          <Link activeClass="active" onSetActive={ this
                                                                       .handleSetActive
                                                                       .bind(this) } className="linear" to="linear" spy={ true } smooth={ true } duration={ 500 }>Linear</Link>
                        </li>
                        <li>
                          <Link activeClass="active" onSetActive={ this
                                                                       .handleSetActive
                                                                       .bind(this) } className="random-intercept" to="random-intercept" spy={ true } smooth={ true }
                            duration={ 500 }>Random Intercept</Link>
                        </li>
                        <li>
                          <Link activeClass="active" onSetActive={ this
                                                                       .handleSetActive
                                                                       .bind(this) } className="random-slope" to="random-slope" spy={ true } smooth={ true } duration={ 500 }>Random Slope</Link>
                        </li>
                        <li>
                          <Link activeClass="active" onSetActive={ this
                                                                       .handleSetActive
                                                                       .bind(this) } className="random-slope-intercept" to="random-slope-intercept" spy={ true } smooth={ true }
                            duration={ 500 }>Random Slope + Intercept</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </nav>
              </div>
              <div className="container">
                <ScatterPlotComponent settings={ scatterSettings } lineData={ lineData } colorScale={ colorScale } data={ chartData } xTitle="Years of Experience"
                  yTitle="Salary" />
                <Element name="Intro" className="element">
                  <Sections sectionNumber={ 0 } />
                </Element>
                <Element name="nested-data" className="element">
                  <Sections sectionNumber={ 1 } />
                </Element>
                <Element name="linear" className="element">
                  <Sections sectionNumber={ 2 } />
                </Element>
                <Element name="random-intercept" className="element">
                  <Sections sectionNumber={ 3 } />
                </Element>
                <Element name="random-slope" className="element">
                  <Sections sectionNumber={ 4 } />
                </Element>
                <Element name="random-slope-intercept" className="element">
                  <Sections sectionNumber={ 5 } />
                </Element>
              </div>
              <footer>
                <div class="footer-copyright">
                  <div class="container">
                    © 2017 Copyright <a href="http://mfviz.com/" target="_blank">Michael Freeman</a>
                    <a class="right" target="_blank" href="http://twitter.com/mf_viz">@mf_viz</a>
                  </div>
                </div>
              </footer>
            </div>
            );
    }
}
;

export default App;