var padding = {top:20, right:40, bottom:0, left:0},
            w = 500 - padding.left - padding.right,
            h = 500 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            oldpick = [],
            color = d3.scale.category20();//category20c()
           
        var data = [
                    {"label":"250 Doge",  "value":1,  "question":"250 Doge"}, 
                    {"label":"5M Shiba",  "value":3,  "question":"5M Shiba"}, //color
                    {"label":"Logitech MX Master 3", "value":10, "question":"Logitech MX Master 3"},
                    {"label":"NFT",  "value":5,  "question":"NFT!"}, //font-size
                    {"label":"Airhorn",  "value":6,  "question":"Airhorn"}, //background-color
                    {"label":"หน้ากาก 3 แพ็ค + แอลกอฮอล์",  "value":7,  "question":"หน้ากาก 3 แพ็ค + แอลกอฮอล์"}, //nesting
                    {"label":"เสื้อคลุมหน่วยสำรวจ",  "value":8,  "question":"เสื้อคลุมหน่วยสำรวจ"}, //bottom
                    {"label":"หนังสือ Utopia",  "value":9,  "question":"หนังสือ Utopia"}, //sans-serif
                    {"label":"ถ้วยรางวัล", "value":11, "question":"ถ้วยรางวัล"},
                    {"label":"250 Doge",  "value":2,  "question":"250 Doge"},
                    {"label":"ปุ่ม enter", "value":12, "question":"ปุ่ม enter"},
                    {"label":"แว่น thug life 20 อัน", "value":14, "question":"แว่น thug life 20 อัน"},
                    {"label":"ลูกอมรสห่วยๆ", "value":13, "question":"ลูกอมรสห่วยๆ"},
                    {"label":"5M Shiba",  "value":4,  "question":"5M Shiba"}, //font-weight
                    {"label":"ตะเกียบ 300 คู่", "value":15, "question":"ตะเกียบ 300 คู่"},
                    {"label":"เชกิน้องออม", "value":18, "question":"เชกิน้องออม"},
                    {"label":"เเมวระเบิด", "value":16, "question":"เเมวระเบิด"},
                    {"label":"Raspberry Pi", "value":17, "question":"Raspberry Pi"}
                    
        ];
        var svg = d3.select('#chart')
            .append("svg")
            .data([data])
            .attr("width",  w + padding.left + padding.right)
            .attr("height", h + padding.top + padding.bottom);
        var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
        var vis = container
            .append("g");
            
        var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);
        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "slice");
            
        arcs.append("path")
            .attr("fill", function(d, i){ return color(i); })
            .attr("d", function (d) { return arc(d); });
        // add the text
        arcs.append("text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
                d.angle = (d.startAngle + d.endAngle)/2;
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
            })
            .attr("text-anchor", "end")
            .text( function(d, i) {
                return data[i].label;
            });
        container.on("click", spin);
        function spin(d){
            
            container.on("click", null);
      
            console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
            if(oldpick.length == data.length){
                console.log("done");
                container.on("click", null);
                return;
            }
            var  ps       = 360/data.length,
                 pieslice = Math.round(1440/data.length),
                 rng      = Math.floor((Math.random() * 1440) + 360);
                
            rotation = (Math.round(rng / ps) * ps);
            
            picked = Math.round(data.length - (rotation % 360)/ps);
            picked = picked >= data.length ? (picked % data.length) : picked;
            if(oldpick.indexOf(picked) !== -1){
                d3.select(this).call(spin);
                return;
            } else {
                oldpick.push(picked);
            }
            rotation += 90 - Math.round(ps/2);
            vis.transition()
                .duration(3000)
                .attrTween("transform", rotTween)
                .each("end", function(){
                    //mark question as seen
                    d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                        .attr("fill", "#111");
                    //populate question
                    d3.select("#question h1")
                        .text(data[picked].question);
                    oldrotation = rotation;
              
                    /* Get the result value from object "data" */
                    console.log(data[picked].value)
              
                    /* Comment the below line for restrict spin to sngle time */
                    container.on("click", spin);
                });
        }
        //make arrow
        svg.append("g")
            .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
            .append("path")
            .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
            .style({"fill":"black"});
        //draw spin circle
        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 60)
            .style({"fill":"white","cursor":"pointer"});
        //spin text
        container.append("text")
            .attr("x", 0)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("SPIN")
            .style({"font-weight":"bold", "font-size":"30px"});
        
        
        function rotTween(to) {
          var i = d3.interpolate(oldrotation % 360, rotation);
          return function(t) {
            return "rotate(" + i(t) + ")";
          };
        }
        
        
        function getRandomNumbers(){
            var array = new Uint16Array(1000);
            var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
            if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
                window.crypto.getRandomValues(array);
                console.log("works");
            } else {
                //no support for crypto, get crappy random numbers
                for(var i=0; i < 1000; i++){
                    array[i] = Math.floor(Math.random() * 100000) + 1;
                }
            }
            return array;
        }