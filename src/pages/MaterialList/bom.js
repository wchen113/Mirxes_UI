import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { OrgChart } from 'd3-org-chart';
import './material.css';
import csv from './sample.csv';

const MaterialList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(csv);
        const dataFlattened = await response.text();
        const parsedData = d3.csvParse(dataFlattened);
        const dataWithDepth = parsedData.map((node) => ({
          ...node,
          depth: 1,
          _collapsed: true,
        }));

        setData(dataWithDepth);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const chartContainer = d3.select('.chart-container');

    const levelZeroData = data.filter(node => node.depth === 1);

    const modifySVG = (svgStr) => {
      return svgStr
        .replace('L135', 'L130')
        .replace('L15', 'L10')
        .replace('L0', 'L5')
        .replace('L150', 'L145');
    };

    const levelColors = [
      '#91e4c1',
      '#8ad554',
      '#b0b0b0',
      '#403047',
      '#54425f',
      '#6b5b7b',
    ];

    const chart = new OrgChart()
      .container('.chart-container')
      .svgHeight(window.innerHeight - 10)
      .data(levelZeroData)
      .nodeHeight(() => 170)
      .nodeWidth((d) => (d.depth === 0 ? 600 : 330))
      .childrenMargin(() => 90)
      .compact(false)
      .neighbourMargin(() => 50)
      .siblingsMargin(() => 100)
      .buttonContent(({ node }) => {
        return `
          <div style="color:white;border-radius:5px;padding:3px;font-size:10px;margin:auto auto;background-color:#040910;border: 1px solid #2CAAE5">
            <span style="font-size:9px">${node.children ? '<i class="fas fa-angle-up"></i>' : '<i class="fas fa-angle-down"></i>'}</span> 
            ${node.data._directSubordinates}
          </div>`;
      })
      .linkUpdate(function (d) {
        d3.select(this)
          .attr('stroke', d.data._upToTheRootHighlighted ? '#14760D' : '#2CAAE5')
          .attr('stroke-width', d.data._upToTheRootHighlighted ? 15 : 1);
        if (d.data._upToTheRootHighlighted) {
          d3.select(this).raise();
        }
      })
      .nodeContent(function (d) {
        const svgStr = `<svg width=150 height=75 style="background-color:none">
                          <path d="M 5,15 L20,0 L130,0 L145,15 L145,60 L130,75 L20,75 L5,60" fill="#2599DD" stroke="#2599DD"/>
                        </svg>`;
        const modifiedSVG = modifySVG(svgStr);

        const backgroundColor = levelColors[d.depth];

        return `
          <div class="left-top" style="position:absolute;left:-10px;top:-10px">${modifiedSVG}</div>
          <div class="right-top" style="position:absolute;right:-10px;top:-10px">${modifiedSVG}</div>
          <div class="right-bottom" style="position:absolute;right:-10px;bottom:-14px">${modifiedSVG}</div>
          <div class="left-bottom" style="position:absolute;left:-10px;bottom:-14px">${modifiedSVG}</div>
          <div style="font-family: 'Inter', sans-serif; background-color:${backgroundColor}; position:absolute; margin-top:-1px; margin-left:-1px; width:${d.width}px; height:${d.height}px; border-radius:0px; border: 2px solid #2CAAE5;">
            <div style="color:black; position:absolute; left:20px; top:20px;">
              <div style="font-size:15px; color:black; margin-top:32px;">${d.data.name}</div>
              <br />
              <div style="font-size:15px; color:black;">Part No: ${d.data.positionName || ''}</div>
            </div>
          </div>`;
      })
      .nodeUpdate(function (d) {
        d3.select(this)
          .select('.node-rect')
          .attr('stroke', d.data._highlighted || d.data._upToTheRootHighlighted ? '#14760D' : 'none')
          .attr('stroke-width', d.data._highlighted || d.data._upToTheRootHighlighted ? 40 : 1);
      })
      .render();

    setTimeout(() => {
      chart.setExpanded('1').setCentered('1').render();
    }, 1000);

    const radialGradientUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QMaAyMA1SdmlAAAAVRJREFUeNrt26FOw2AUhuFTElzrETNLMNPtJVRVVFbtlnYXKGQFqldANo3EoLDUITazzCxBTNBk53lv4M+XJ/ndKZ52L9uft9eP+Oeqbtgs8O7+cbWO36/PiIgmwd4ojsdIU9n2l7XzNBYZNj9Eos6oTRbcdMAZAwxYgAVYgAVYgAUYsAALsAALsAALMGABFmABFmABFmABBizAAqwFgZ/fv+slHl7q3aobNpn2proujIgo276ep/HgixZgARZgARZgAQYswAIswAIswAIswIAFWIAFWIAFWIABC7AAC7AAC7D+AHZdeN97XRf6ogVYgAVYgAVYgAELsAALsAALsAADFmABFmABFmABFmDAAizAAizAAqxrYNeF973XdaEvWoAFWIAFWIAFGLAAC7AAC7AACzBgARZgARZgARZgAQYswAIswAKsW0p1m1S2/WXtPI1Fhs0nxU1Jj2yxm2sAAAAASUVORK5CYII=';
    const radialGradientCss = `radial-gradient(circle at center, #04192B 0, #000B0E 100%) url("${radialGradientUrl}")`;

    chartContainer.style.background = radialGradientCss;
  }, [data]);

  return <div className="chart-container"></div>;
};

export default MaterialList;