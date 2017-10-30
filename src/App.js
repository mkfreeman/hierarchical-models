import './App.css';
import ScatterPlotComponent from './ScatterPlotComponent';
import * as d3 from 'd3';
import Sections from './Sections';

var ReactGA = require('react-ga');
var FontAwesome = require('react-fontawesome');
function logPageView() {
    ReactGA.set({
        page: window.location.pathname + window.location.search
    });
    ReactGA.pageview(window.location.pathname + window.location.search);
}
var React = require('react');
var ReactDOM = require('react-dom');
var Scroll = require('react-scroll');

// Scrolling variables
var Link = Scroll.Link;
var DirectLink = Scroll.DirectLink;
var Element = Scroll.Element;
var Events = Scroll.Events;
var scroll = Scroll.animateScroll;
var scrollSpy = Scroll.scrollSpy;
var scroller = Scroll.scroller;

var durationFn = function (deltaTop) {
    return deltaTop;
};

// List of elements
const elementList = [
    {
        id: 'intro',
        name: "Introduction"
    }, {
        id: 'nested-data',
        name: "Nested Data"
    }, {
        id: 'linear',
        name: "Linear Model"
    }, {
        id: 'random-intercept',
        name: "Random Intercept"
    }, {
        id: 'random-slope',
        name: "Random Slope"
    }, {
        id: 'random-slope-intercept',
        name: "Random Slope + Intercept"
    }, {
        id: 'about',
        name: "About"
    }
];

class App extends React.Component {

    constructor(props) {
        super(props);
        this.scrollToTop = this
            .scrollToTop
            .bind(this);
        this.state = {
            dataStep: 0,
            allData: [],
            width: 0,
            height: 0,
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
                }, {
                    pack: false,
                    hideAxes: false
                }, {
                    pack: false,
                    hideAxes: true
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

        // Page title
        document.title = "Hierachical Models";
        Events
            .scrollEvent
            .register('begin', function () {
                // console.log("begin", arguments);
            });

        Events
            .scrollEvent
            .register('end', function () {
                // console.log("end", arguments);
            });

        // Listen for resize
        window.addEventListener("resize", this.onResize());

        scrollSpy.update();
        d3.csv('data/faculty-data.csv', function (error, data) {
            // let formatted = data.map((d) => {{id:d.id, x:d.experience, y:d.salary})
            let formatted = data.map(function (d) {
                return {id: d.ids, x: d.experience, y: d.salary, color: d.department}
            })
            let random = data.map(function (d) {
                return {
                    id: d.ids,
                    x: Math.random(),
                    y: Math.random(),
                    color: d.department
                }
            });

            // Function to grab column of interest
            let GetLineData = function (col) {
                let allData = data.map(function (d) {
                    return {
                        x: + d.experience,
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

                nested.map(function (d) {
                    let xMin = d3.min(d.values, (d) => + d.x)
                    let xMax = d3.max(d.values, (d) => + d.x)
                    let ret = d
                        .values
                        .filter((d) => d.x == xMax | d.x == xMin)
                        .sort(function (a, b) {
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

            // Width
            let dims = this.getDimensions();
            this.setState({
                allData: [
                    random,
                    formatted,
                    formatted,
                    formatted,
                    formatted,
                    formatted,
                    random
                ],
                allLineData: [
                    [],
                    [],
                    simpleModel,
                    randomIntercept,
                    randomSlopes,
                    randomSlopeIntercept
                ],
                width: dims.width,
                height: dims.height
            });
        }.bind(this))
    }
    scrollToTop() {
        scroll.scrollToTop();
    }

    // Get dimensions
    getDimensions() {
        let wrapper = document.getElementById('main-wrapper');
        let fullWidth = wrapper == null
            ? 0
            : wrapper.offsetWidth;
        let fraction = window.innerWidth < 960
            ? .55
            : .75;
        let width = fullWidth * fraction;
        let height = wrapper == null
            ? 0
            : window.innerHeight - 140;

        let sectionWidth = fullWidth * (.97 - fraction);
        return {fullWidth: fullWidth, width: width, height: height, sectionWidth: sectionWidth};
    }

    // Resize
    updateDimensions() {
        let dims = this.getDimensions();
        this.setState({width: dims.width, height: dims.height})
    }

    onResize = () => this
        .updateDimensions
        .bind(this);

    componentWillUnmount() {
        Events
            .scrollEvent
            .remove('begin');
        Events
            .scrollEvent
            .remove('end');

        // Resize event
        window.removeEventListener("resize", this.onResize);

    }
    handleSetActive(to) {
        let dataStep = 0;
        switch (to) {
            case('intro'):
                dataStep = 0
                break;
            case('nested-data'):
                dataStep = 1
                break;
            case('linear'):
                dataStep = 2
                break;
            case('random-intercept'):
                dataStep = 3
                break;
            case('random-slope'):
                dataStep = 4
                break;
            case('random-slope-intercept'):
                dataStep = 5;
                break;
            case('about'):
                dataStep = 6;
                break;
        }
        this.setState({dataStep: dataStep})
    }
    render() {
        let colorScale = this.state.colorScales[this.state.dataStep];
        let chartData = this.state.allData[this.state.dataStep];
        let lineData = this.state.allLineData[this.state.dataStep];
        let scatterSettings = this.state.scatterSettings[this.state.dataStep];
        let nextIndex = this.state.dataStep == elementList.length - 1
            ? 0
            : this.state.dataStep + 1
        let scrollNext = () => scroller.scrollTo(elementList[nextIndex].id, {
            duration: 1500,
            delay: 100,
            smooth: true,
            offset: nextIndex == 0
                ? 0
                : 50
        })
        let icon = nextIndex == 0
            ? "chevron-up"
            : "chevron-down"

        let dims = this.getDimensions();
        let sectionStyle = {
            width: dims.sectionWidth
        }
        return (
            <div>
                <div className="container">
                    <nav className="navbar navbar-default navbar-fixed-top">
                        <div className="container">
                            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <ul className="nav navbar-nav">
                                    {elementList
                                        .map(function (d) {
                                            let offset = d.id == "intro"
                                                ? 0
                                                : 50;
                                            return <li>
                                                <Link
                                                    activeClass="active"
                                                    onSetActive={this
                                                    .handleSetActive
                                                    .bind(this)}
                                                    className={d.id}
                                                    offset={offset}
                                                    to={d.id}
                                                    spy={true}
                                                    smooth={true}
                                                    duration={500}>
                                                    {d.name}
                                                </Link>
                                            </li>
                                        }.bind(this))}
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                <div id="main-wrapper" className="container">
                    <ScatterPlotComponent
                        settings={scatterSettings}
                        lineData={lineData}
                        colorScale={colorScale}
                        data={chartData}
                        width={this.state.width}
                        height={this.state.height}
                        marginLeft={dims.fullWidth - dims.width}
                        xTitle="Years of Experience"
                        yTitle="Salary"/> {elementList
                        .map(function (d, i) {
                            return <Element name={d.id} className="element">
                                <Sections sectionNumber={i} styles={sectionStyle}/>
                            </Element>
                        }.bind(this))}
                    <div id="scroll-wrapper">
                        <FontAwesome id="scroll-down" name={icon} size="3x" onClick={scrollNext}/>
                    </div>
                </div>
                <footer>
                    <div className="footer-copyright">
                        <div className="container">
                            © 2017 Copyright
                            <a href="http://mfviz.com/" target="_blank">&nbsp;Michael Freeman</a>
                            <a class="right" target="_blank" href="http://twitter.com/mf_viz">@mf_viz</a>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }
};

export default App;