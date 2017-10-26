// Sections
import React, { Component } from 'react';
import { Tex, InlineTex } from 'react-tex';
import './Sections.css';
var FontAwesome = require('react-fontawesome');
var ReactMarkdown = require('react-markdown');


// Written Sections
class Sections extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        // let latexString = `y_i = \\alpha_{j[i]} + \\beta x_i`;
        let latexString = "\int_{a}^{b} f(x)dx = F(b) - F(a)";


        switch (this.props.sectionNumber) {
            case 0:
                var ele = <div>
                            <h1 id="intro">An Introduction to Hierarchical Modeling</h1>
                            <p>This visual explanation introduces the statistical concept of <strong>Hierarchical Modeling</strong>, also known as <em>Multilevel Modeling</em> or by
                              <a href="https://en.wikipedia.org/wiki/Multilevel_model" target="_blank"> these other terms</a>. This is an approach for modeling <strong>nested data</strong>.
                              Scroll down to learn about <em>why</em> you would use this analytical approach.</p>
                            <div id="scroll-wrapper">
                              <FontAwesome id="scroll-down" name="chevron-down" size="3x" onClick={ this.props.clickEvent } />
                            </div>
                          </div>
                break;
            case 1:
                var ele = <div>
                            <h1>Nested Data</h1>
                            <p>You’ll frequently encounter nested data structures when doing analytical work. These are instances in which each observation is a member of a group, and you believe
                              that group membership has an important effect on your outcome of interest. As we walk through this explanation, we'll consider this example</p>
                            <blockquote>Estimating faculty salaries, where the faculty are drawn from different <em>departments</em>. </blockquote>
                            <p>As you could imagine, the group (<em>department</em>) that a faculty member belongs to could determine their salary in different ways.
                            </p>
                          </div>
                break;
            case 2:
                var ele = <div>
                            <h1>A Linear Approach</h1>
                            <p>Let's imagine that you're trying to estimate faculty salary based on the number of years of experience that they have. A simple (linear) model could be used to
                              estimate this relationship:
                            </p>
                            <div className="eq-wrapper">
                              <Tex texContent="\hat{y} = \beta_0 + \beta_1x_1 + ... + \beta_nx_n" />
                            </div>
                            <p>In the above equation, you would estimate the parameters (beta values) for your variables of interest. These are knows as the <strong>fixed effects</strong> because
                              they are constant (<em>fixed</em>) for each individual. In our case, we would simply use years of experience to predict salary:</p>
                            <div className="eq-wrapper">
                              <Tex texContent="salary_i = \beta_0 + \beta_1 * experience_i" />
                            </div>
                            <p>
                              However, it's clear that there's variation in salary <strong>by department</strong>. The methods introduced below allow us to capture that information in different
                              ways.
                            </p>
                          </div>
                break;
            case 3:
                var ele = <div>
                            <h1>Random Intercepts</h1>
                            <p>It may be the case that each <strong>department</strong> has a different starting salary for their faculty members, and the annual salary increase is consistent
                              across the university. If we believe this to be the case, we would want to allow the <strong>intercept to vary</strong> <em>by group</em>. We could describe
                              a <strong>mixed effects</strong> model that allows intercepts to vary by group:
                            </p>
                            <div className="eq-wrapper">
                              <Tex texContent="\hat{y_i} = \alpha_{j[i]} + \beta x_i" />
                            </div>
                            <p>In the above equation, the vector of <strong>fixed effects</strong> (constant slopes) is represented by the
                              <em> β</em> character, while the set of <strong>random intercepts</strong> is captured by the α. So, individual <code>i</code> in department <code>j</code> would
                              have the following salary: </p>
                            <div className="eq-wrapper">
                              <Tex texContent="salary_i = department_{j[i]} + \beta_1 * experience_i" />
                            </div>
                            <p>This strategy allows us to capture variation in the starting salary of our faculty. However, there may be addition information we want to incorporate into our
                              model
                            </p>
                          </div>
                break;
            case 4:
                var ele = <div>
                            <h1>Random Slopes</h1>
                            <p>Alternatively, we could imagine that faculty salaries increase at <strong>different rates</strong> depending on the department. We could incorporate this idea
                              into a statistical model by allowing the <strong>slope</strong> to vary rather than the intercept. We could formalize this with the following notation:</p>
                            <div className="eq-wrapper">
                              <Tex texContent="\hat{y_i} = \beta_0 + \beta_{j[i]}x_i" />
                            </div>
                            <p>Here, the intercept (<em>β<sub>0</sub></em>) is constant(fixed) for all individuals, but the slope (<em>β<sub>j</sub></em> varies depending on the department (<code>j</code>)
                              of individual <code>i.</code>So, individual <code>i</code> in department <code>j</code> would have the following salary: </p>
                            <div className="eq-wrapper">
                              <Tex texContent="\hat{salary_i} = \beta_0 + \beta_{1j[i]} * experience_i" />
                            </div>
                            <p>While This strategy allows us to capture variation in the <em>change in salary</em>, it is clearly a poor fit for the data. We can, however, combine these strategies
                              for a better fitting model.
                            </p>
                          </div>
                break;
            case 5:
                var ele = <div>
                            <h1>Random Slopes + Intercepts</h1>
                            <p>It's reasonable to image that the most realistic situation is a combination of the scenarios described above:</p>
                            <blockquote>Faculty salaries start at different levels <em>and</em> increase at different rates depending on their department.
                            </blockquote>
                            <p>To incorporate both of these realities into our model, we want both the slope and the intercept to vary depending on the department of the faculty member. We can
                              describe this with the following notation:</p>
                            <div className="eq-wrapper">
                              <Tex texContent="\hat{y_i} = \alpha_{j[i]} + \beta_{j[i]}x_i" />
                            </div>
                            <p>Thus, the <em>starting salary</em> for faculty member <code>i</code> depends on their department (<em>α<sub>j[i]</sub></em>), and their annual raise also varies
                              by department (<em>β<sub>j[i]</sub></em>)
                            </p>
                          </div>
                break;
            default:
                var ele = '';
        }
        return <div className="Sections">
                 { ele }
               </div>;
    }
}
export default Sections;