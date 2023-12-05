import * as d3 from "d3";
import React, { useEffect, useState } from "react";

const ScatterPlot = (props) => {
    const data1 = props.item1
    const data2 = props.item2
    const data3 = props.item3
    const axisLen = 10;
    const x = d3.scaleLinear()
        .domain(d3.extent(data1))
        .range([0, 450])
        .nice();

    const y = d3.scaleLinear()
        .domain(d3.extent(data2))
        .range([0, 450])
        .nice();

    console.log(props.displayVersicolor);
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    return (
        <svg width={props.w} height={props.h}>
            <g transform="translate(100, 600) scale(1, -1)">
                <line x1={0} y1={0} x2={450} y2={0} stroke='black' />
                <line x1={0} y1={0} x2={0} y2={450} stroke='black' />
                {x.ticks().map((item, index) => {
                    return <g transform="scale(1, -1)">
                        <line key={index} x1={x(item)} y1={0} x2={x(item)} y2={axisLen} stroke="black"></line>
                        <text textAnchor="middle" dominantBaseline="hanging" x={x(item)} y={10}>{item}</text>
                    </g>
                })
                }

                {y.ticks().map((item, index) => {
                    return <g transform="scale(1, -1)">
                        <text textAnchor="end" dominantBaseline="middle" x={-10} y={-y(item)}>{item}</text>
                        <line key={index} x1={0} y1={-y(item)} x2={-axisLen} y2={-y(item)} stroke="black"></line>
                    </g>
                })
                }
                <g transform="scale(1, -1)">
                    <text x={200} y={50}>{props.option1}</text>
                </g>
                <g transform="scale(1, -1) rotate(270)">
                    <text x={200} y={-50}>{props.option2}</text>
                </g>
                {data3.map((item, index) => {
                    let c;
                    let display;
                    if (item === "setosa") {
                        c = color(0);
                        display = props.displaySetosa;
                    } else if (item === "versicolor") {
                        c = color(1);
                        display = props.displayVersicolor;
                    } else {
                        c = color(2);
                        display = props.displayVignica;
                    }
                    if (display) {
                        return (
                            <circle key={index} cx={x(data1[index])} cy={y(data2[index])} r={5} fill={c} style={{transitionDuration: "2s"}}></circle>
                        )
                    } else {
                        return null;
                    }
                })}
            </g>
        </svg>
    )
}


function App() {
    const [data, setData] = useState([]);
    const url = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json';


    useEffect(() => {
        fetch(url).then((response) => response.json())
            .then((jsonData) => {
                setData(jsonData);
            });
    }, [])
    const options = [
        { value: "sepalLength", label: "SepalLength" },
        { value: "sepalWidth", label: "SepalWidth" },
        { value: "petalLength", label: "PetalLength" },
        { value: "petalWidth", label: "PetalLength" }
    ]
    const [horizontalAxis, setHA] = useState(options[0].value);
    const [varticalAxis, setVA] = useState(options[1].value);
    const [displaySetosa, setSetosa] = useState(true);
    const [displayVersicolor, setVersicolor] = useState(true);
    const [displayVignica, setVignica] = useState(true);
    const w = 800;
    const h = 800;
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const HAchange = (event) => {
        setHA(event.target.value);
    };
    const VAchange = (event) => {
        setVA(event.target.value);
    };
    return (
        <div
            initial={{ opacity: 0 }} // 初期状態のスタイル
            animate={{ opacity: 1 }} // アニメーション後のスタイル
            transition={{ duration: 2.5 }} // アニメーションの時間
        >
            <p>HorizontalAxis:</p>
            <select value={horizontalAxis} onChange={HAchange}>
                {options.map((item) => <option value={item.value}>{item.label}</option>)}
            </select>
            <p>VarticalAxis:</p>
            <select value={varticalAxis} onChange={VAchange}>
                {
                    options.map((item) => <option value={item.value}>{item.label}</option>)
                }
            </select>
            <p></p>
            <svg width={w} height={h}>
                {/*<Axis w={w} h={h} option1={horizontalAxis} option2={varticalAxis} item1={data.map((item, index) => item[horizontalAxis])} item2={data.map((item, index) => item[varticalAxis])} />
                <Circle w={w} h={h} item1={data.map((item, index) => item[horizontalAxis])} item2={data.map((item, index) => item[varticalAxis])} item3={data.map((item, index) => item.species)} />*/}
                <ScatterPlot w={w} h={h} displaySetosa={displaySetosa} displayVersicolor={displayVersicolor} displayVignica={displayVignica} option1={horizontalAxis} option2={varticalAxis} item1={data.map((item, index) => item[horizontalAxis])} item2={data.map((item, index) => item[varticalAxis])} item3={data.map((item, index) => item.species)} />
                <g transform="translate(0, 600) scale(1, -1)">
                    <g transform="translate(500, 430)">
                        <rect x={0} y={0} width={12} height={12} fill={color(0)}></rect>
                        <rect x={0} y={-30} width={12} height={12} fill={color(1)}></rect>
                        <rect x={0} y={-60} width={12} height={12} fill={color(2)}></rect>
                        <g transform="scale(1, -1)">
                            <text x={20} y={-2} onClick={() => setSetosa(!displaySetosa)}>setosa</text>
                            <text x={20} y={28} onClick={() => setVersicolor(!displayVersicolor)}>versicolor</text>
                            <text x={20} y={58} onClick={() => setVignica(!displayVignica)}>virginica</text>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    );
}
export default App;
