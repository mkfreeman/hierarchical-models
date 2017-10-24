// Sections
import React, { Component } from 'react';
import { Tex } from 'react-tex';
import './Sections.css';
var ReactMarkdown = require('react-markdown');
// var Latex = require('react-latex');

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
                var ele = <ReactMarkdown source={ "# Nested Data \nIn this module, you'll be familiarized with **multi-level models** as an approach for modeling _nested data_. You'll frequently encounter nested data structures, for example: \n\- Predicting **student** college admissions, where students are drawn from different _high schools_ \n\- Modeling **patient** health outcomes, where patients are drawn from different _hospitals_ \n\- Estimating **faculty** salaries, where the faculty are drawm from different _departments_ \n\n\In each example above the **observations** (**students**, **patients**, **faculty**) belong to different _groups_ (_schools_, _hospitals_, _departments_). These data can be described as **nested** because each observation comes from within a group (and we believe these groups to be related to the outcome). As you can imagine, there could be some effect at the _group level_, as well as the individual level. For example, a student's college acceptance may depend on _individual predictors_, such as their GPA, number of volunteer activities, and other factors. However, their admissions status may also depend on which _school_ they belong to, based on the reputation of that school, financial aid, or other factors. In this module, we'll explore various (introductory) ways to handle nested data." } />
                break;
            case 1:
                var ele = <div>
                            <ReactMarkdown source={ "## Vocabulary\n\There are a variety of different terms that statisticians use to refer to modeling nested data. Confusingly, _many terms_ may refer to the _same procedure_, and many people may use the _same term_ to refer to _different procedures_. The vocabulary introduced here largely comes from this [cannonical text](https://www.amazon.com/Analysis-Regression-Multilevel-Hierarchical-Models/dp/052168689X). \n\n\ #### _Multi-level models_ \n\n\ This term refers to modeling strategies for working with nested data. Using one of many possible approaches, these appropriately handle the fact that variables may exist at multiple levels (i.e., a dataset may describe _individuals_ as well as the _cities_ they come from). These are also often referred to as **hierarchical models**, because the data exist in a hierarchical structure (i.e., people within cities)\n\n #### _Fixed effects_ \n\n One component of a multi-level model is the set of _fixed effects_ that are estimated. These, in short, are the betas (coefficients) you are familiar with estimating (i.e., each beta value in this formula): " } />
                            <ul className="no-bullets">
                              <li>
                                <Tex texContent="\hat{y} = \beta_0 + \beta_1x_1 + ... + \beta_nx_n"></Tex>
                              </li>
                            </ul>
                            <ReactMarkdown source={ "These effects are considered _fixed_ because they are _constant_ across individuals (observations) in the dataset, and are commonly estimated through least-squares(or, more genearlly, maximum liklihood methods). While [this text](https://www.amazon.com/Analysis-Regression-Multilevel-Hierarchical-Models/dp/052168689X) prefers to refer to these as **constant slopes** (and intentionally avoids the term _fixed effects_), you will encounter it commonly in other literature.\n\n\ #### _Random effects_ \n\n This an an umbrella term referred to ways in which you can incorporate information about _group level variation_ in your model (i.e., variation across the _cities_ that _individuals_ live within). Broadly speaking, one may expect the variation across groups to vary _randomly_, and multi-level models allow you to incorporate that information in various ways. In the section below, we'll describe the ways in which this variation can be built into your model" } />
                          </div>
                break;
            case 2:
                var ele = <div>
                            <ReactMarkdown source={ "### Varying Intercept \n\nOne type of **random effect** is to allow each group to determine the _intercept_ for each observation. Using faculty salary data as an example, it may be the case that each _department_ has a different baseline salary for each faculty member, but the averge increase in salary for each year of experience is consistent across the _University_. This could be written as a _mixed effects_ model as follows:" } />
                            <Tex texContent="y_i = \alpha_{j[i]} + \beta x_i" />
                            <div>
                              <p>In the above formula, the vector of <strong>fixed effects</strong> (constant slopes) is represented by the term <span>&beta</span>. The <strong>random intercept</strong>,
                                for individual <span>(i)</span> group <span>(j)</span> is denoted as . Applying this to the simulated faculty dataset (from <code>faculty-data.R</code>), the
                                formula be written as:</p>
                            </div>
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