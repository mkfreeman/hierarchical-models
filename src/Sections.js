// Sections
import React, {Component} from 'react';
import {Tex} from 'react-tex';
import './Sections.css';

// Written Sections
class Sections extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    let ele = null;
    switch (this.props.sectionNumber) {
      case 0:
        ele = <div>
          <h1 id="intro">An Introduction to Hierarchical Modeling</h1>
          <p>This visual explanation introduces the statistical concept of&nbsp;
            <strong>Hierarchical Modeling</strong>, also known as&nbsp;
            <em>Mixed Effects Modeling</em>&nbsp;or by&nbsp;
            <a href="https://en.wikipedia.org/wiki/Multilevel_model" target="_blank">
              these other terms</a>. This is an approach for modeling&nbsp;
            <strong>nested data</strong>. Keep reading to learn how to translated an
            understanding of your data into a hierarchical model specification.</p>
        </div>
        break;
      case 1:
        ele = <div>
          <h1>Nested Data</h1>
          <p>You’ll frequently encounter nested data structures when doing analytical
            work. These are instances in which each observation is a member of a group, and
            you believe that group membership has an important effect on your outcome of
            interest. As we walk through this explanation, we'll consider this example</p>
          <blockquote>Estimating faculty salaries, where the faculty work in different&nbsp;
            <em>departments</em>.
          </blockquote>
          <div className="span-wrapper">
            As you could imagine, the group (<em>department</em>) that a faculty member
belongs to could determine their salary in different ways. In this example,
we'll consider faculty who work in the&nbsp;
            <span style={{
              color: 'rgba(148, 103, 189, .5)'
            }}>Informatics</span>
            <span>,&nbsp;</span>
            <span style={{
              color: 'rgba(214, 39, 40, .5)'
            }}>English</span>
            <span>,&nbsp;</span>
            <span style={{
              color: 'rgba(255, 127, 14, .5)'
            }}>Sociology</span>
            <span>,&nbsp;</span>
            <span style={{
              color: 'rgba(44, 160, 44, .5)'
            }}>Biology</span>
            <span>, and&nbsp;</span>
            <span style={{
              color: 'rgba(140, 86, 75, .5)'
            }}>Statistics</span>
            &nbsp; departments.
          </div>
        </div>
        break;
      case 2:
        ele = <div>
          <h1>A Linear Approach</h1>
          <p>Let's imagine that you're trying to estimate faculty salary based on the
            number of years of experience that they have. A simple (linear) model could be
            used to estimate this relationship:
          </p>
          <div className="eq-wrapper">
            <Tex texContent="\hat{y} = \beta_0 + \beta_1x_1 + ... + \beta_nx_n"/>
          </div>
          <p>In the above equation, you would estimate the parameters (beta values) for
            your variables of interest. These are known as the&nbsp;
            <strong>fixed effects</strong>&nbsp;because they are constant (<em>fixed</em>)
for each individual. In our case, we would simply use years of experience to
predict salary:</p>
          <div className="eq-wrapper">
            <Tex texContent="\hat{salary_i} = \beta_0 + \beta_1 * experience_i"/>
          </div>
          <p>
            While this provides some information about the observed relationship, it's clear
            that there's variation in salary&nbsp;
            <strong>by department</strong>. The methods introduced below allow us to capture
            that variation in different ways.
          </p>
        </div>
        break;
      case 3:
        ele = <div>
          <h1>Random Intercepts</h1>
          <p>It may be the case that each&nbsp;
            <strong>department</strong>&nbsp; has a different starting salary for their
            faculty members, and the annual salary increase rate is consistent across the
            university. If we believe this to be the case, we would want to allow the&nbsp;
            <strong>intercept to vary</strong>&nbsp;
            <em>by group</em>. We could describe a&nbsp;
            <strong>mixed effects</strong>&nbsp; model that allows intercepts to vary by group:
          </p>
          <div className="eq-wrapper">
            <Tex texContent="\hat{y_i} = \alpha_{j[i]} + \beta x_i"/>
          </div>
          <p>In the above equation, the vector of&nbsp;
            <strong>fixed effects</strong>&nbsp; (constant slopes) is represented by the&nbsp;
            <em>
              β</em>&nbsp;character, while the set of&nbsp;
            <strong>random intercepts</strong>&nbsp; is captured by the α. So, individual
            <code>i</code>
            in department
            <code>j</code>
            would have the following salary:
          </p>
          <div className="eq-wrapper">
            <Tex texContent="\hat{salary_i} = \beta_{0j[i]} + \beta_1 * experience_i"/>
          </div>
          <p>This strategy allows us to capture variation in the starting salary of our
            faculty. However, there may be addition information we want to incorporate into
            our model
          </p>
        </div>
        break;
      case 4:
        ele = <div>
          <h1>Random Slopes</h1>
          <p>Alternatively, we could imagine that faculty salaries increase at&nbsp;
            <strong>different rates</strong>&nbsp; depending on the department. We could
            incorporate this idea into a statistical model by allowing the&nbsp;
            <strong>slope</strong>&nbsp; to vary rather than the intercept. We could
            formalize this with the following notation:</p>
          <div className="eq-wrapper">
            <Tex texContent="\hat{y_i} = \beta_0 + \beta_{j[i]}x_i"/>
          </div>
          <p>Here, the intercept (<em>β<sub>0</sub>
            </em>) is constant(fixed) for all individuals, but the slope (<em>β<sub>j</sub>
            </em>) varies depending on the department (<code>j</code>) of an individual (
            <code>i.</code>). So, individual&nbsp;
            <code>i</code>
            in department&nbsp;
            <code>j</code>
            would have the following salary:
          </p>
          <div className="eq-wrapper">
            <Tex texContent="\hat{salary_i} = \beta_0 + \beta_{1j[i]} * experience_i"/>
          </div>
          <p>While this strategy allows us to capture variation in the&nbsp;
            <em>change in salary</em>, it is clearly a poor fit for the data. We can,
            however, describe group-level variation in both slope and intercept for a better
            fitting model.
          </p>
        </div>
        break;
      case 5:
        ele = <div>
          <h1>Random Slopes + Intercepts</h1>
          <p>It's reasonable to image that the most realistic situation is a combination
            of the scenarios described above:</p>
          <blockquote>Faculty salaries start at different levels&nbsp;
            <em>and</em>&nbsp; increase at different rates depending on their department.
          </blockquote>
          <p>To incorporate both of these realities into our model, we want both the slope
            and the intercept to vary depending on the department of the faculty member. We
            can describe this with the following notation:</p>
          <div className="eq-wrapper">
            <Tex texContent="\hat{y_i} = \alpha_{j[i]} + \beta_{j[i]}x_i"/>
          </div>
          <p>Thus, the&nbsp;
            <em>starting salary</em>&nbsp; for faculty member&nbsp;
            <code>i</code>&nbsp; depends on their department (<em>α<sub>j[i]</sub>
            </em>), and their annual raise also varies by department (<em>β<sub>j[i]</sub>.
            </em>):</p>
            <div className="eq-wrapper">
              <Tex
                texContent="\hat{salary_i} = \beta_{0j[i]} + \beta_{1j[i]} * experience_i"/>
            </div>
            <p>
            In order to implement any of these methods, you'll need to have a strong
            understanding of the phenomenon you're modeling, and how that is captured in the
            data. And, of course, you'll need to assess the performance of your models (not
            described here).
          </p>
        </div>
        break;
      case 6:
        ele = <div>
          <h1>About</h1>
          <p>This project was built by&nbsp;
            <a href="http://mfviz.com/" target="_blank">Michael Freeman</a>, a faculty member at the University of Washington&nbsp;<a href="https://ischool.uw.edu/" target="_blank">
              Information School</a>.
          </p>
          <p>
            All code for this project is&nbsp;
            <a href="https://github.com/mkfreeman/hierarchical-models/" target="_blank">on GitHub</a>, including the script to create the data and run regressions (done in
            <code>R</code>). Feel free to issue a pull request for improvements, and if you
            like it, share it on&nbsp;
            <a
              href="http://twitter.com/home?status=Check out a Visual Introduction to Hierarchical Modeling by @mf_viz. http://mfviz.com/hierarchical-models"
              target="_blank">Twitter</a>. Layout inspired by&nbsp;
            <a href="https://twitter.com/tonyhschu" target="_blank">Tony Chu</a>.
          </p>
        </div>
        break;
      default:
        ele = '';
    }
    return <div className="Sections" style={this.props.styles}>
      {ele}
    </div>;
  }
}
export default Sections;