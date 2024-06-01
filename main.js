var filter1 = document.getElementsByTagName('defs')[0];
filter1.innerHTML = '<filter id="filter1" x="0" y="0" width="100%" height="100%"> <feSpecularLighting result="spec1" specularExponent="12" lighting-color="yellow"> <fePointLight x="0" y="0" z="14" > <animate attributeName="x" values="-467.5;517.5;517.5" keyTimes="0;0.5; 1" dur="3s" repeatCount="indefinite" /> </fePointLight> </feSpecularLighting> <feComposite in="SourceGraphic" in2="spec1" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" /> </filter>'
var allRectangles = document.getElementsByTagName('rect');
Array.from(allRectangles).forEach((element) => {
    element.style.filter = 'url(#filter1)';
});

const scriptgsap = document.createElement("script");
scriptgsap.src = "./gsap.min.js";
scriptgsap.setAttribute("type", "text/javascript");
var elements = document.querySelectorAll('rect, image, text, path, circle');
const sortedElements = Array.from(elements).sort(function (a, b) {
    return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
});
const inAnimation = () => {
    document.body.style.opacity = 1;
    sortedElements.forEach((element, index) => {
        var pathTransform = 0;
        if (element.tagName === 'path') {
            pathTransform = element.transform.animVal[0].matrix.e
        }
        const scalefactor = element.parentNode.getCTM().a;
        gsap.set(element, { x: -2100 / scalefactor, opacity: 0 });
        gsap.to(element, {
            x: (element.tagName === 'path') ? pathTransform : 0,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.03,
            ease: "",
        });
    });
}
const outAnimation = () => {
    sortedElements.forEach((element, index) => {
        const scalefactor = element.parentNode.getCTM().a;
        gsap.set(element, { x: -2100 / scalefactor, opacity: 0 });
        gsap.from(element, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            delay: (sortedElements.length - index - 1) * 0.03,
            ease: "power2.out"
        });
    });
}

document.body.appendChild(scriptgsap);

const fetchCSV = async (filePath) => {
    const response = await fetch(filePath);
    const csv = await response.text();
    return csv;
};

const csvContent = `
ccgf0,ccgf1,ccgf2,ccgf3,ccg_41,ccg_49
aa0,aa0,aa0,aa0,"data:image/png;base64,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","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAB4CAMAAACJp+2jAAAAPFBMVEX/AAD/BAz/HyH/Li3/ODr/Rkn/XV//a2z/eHn/h4f/np7/q6r/tLX/wcL/ycn/1dX/5uX/8fL/+/r+//xsBMgwAAADKklEQVR42u2c7ZKrIAyGCSICiiDn/u/19GPd1VaptkwJTPjV6TQZn4GEN0HK2Pnx7yuDfWcQDMEQDMEQDMEQDMEQDMEQDMFERwgVwRhTD0zgPFQDoxnTtcB4YAymSmDU1UjVAXOdmMvU+Cpg5N1K1gDjZjNXAUw7m7Xlw9g/u7FQGP88Mcup8UXBKGHvH4al4fAzWUIVBdNfstc14EOzNBRXUeMuc9UXBXNLYdI6ubaUzsqjiQ0PTICYAwhlZTMRcyAKS81dzEFXGIyJOTCFwYwxB2NhMLEMcCj+UcmZZt++KU6byX17WQhMWNb9e0Nv/BwhTGh/S/1h336YfzO1ATHMyH4fz+/b+1/0WF7LDqMWAcH3zPnMIqNtjgww0/QoYvRzIbMe7SKqxL6vDDCecantz9qaYLG/qz1ztdAIczstWC0587mX2W01QSONC+H+/DDMJc32uBczw31XVSE4IxtYrr98MH+KEuZNH8ZVV2Yz/kd4tHrUnzlgtlIwuIiguYkZB7GUnQ1m2nos7vcFzVXM+K1U99COzpKaN8swMe3m5gvMJGJZLifMtm4R/a6e0b14oXLywbhUbh0CmHjv4vh4rHLyyBmZxqtEoc1MGq8GBYxP49XjUM1JgobjKAGmJDBPJ7g5YELP03jlfcgMMylI5xfUlBVGpvUss8IEndKxDrlLgGTrDAYE2ixVAnAoNk2RwqlAsmkG9blPFdD0zfoPAwd6TE3A8aPA4SOujuYngSM8tvZs6N511wWEvWbzVuCAwdk4t2/QgMV6CnA+cIRHfNh0UnhKzIdNJ4WnRn0MeGr/hB7/afNw1M1QwtH5QTHAS3gP4GiH89V7Gihg7FE3YwEwh+sBVQDM+owJeNvpy1dcdy1fL8AGP8zcrAUhlbF+vg1wq4mDt0ZJMTN59DCat1L3bt2fBFj3QF2vZctNmde04A0bxDD1XNMKjE3VwPhXwU4wmWBcTTDj6WtNiGFsTTDD2VtNmGH6mmAMY7YmmKEaGF0TjDp2y6wMmO7glRmC+TaMrAmmreifGuqC8d7XU5y9NQiGYAiGYAiGYAiGYAiGYAiGYOLjP2outZEJm1X1AAAAAElFTkSuQmCC"
aa1,aa1,aa1,aa1,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAB4AgMAAADDF/UCAAAADFBMVEUEAQBVCwyVEhTmGR4R/hqBAAADaElEQVRYw+2YMW/UMBSAn3MioUTiJqTqkHoMDJUQ5BfAuarEwkCH7mVjzMrAkYhfEBYYYeh0DGVgYKD1VfyBTEhsqdShKgOHdKCkXPx4Dki49IRfGFi4DG0s+ZP9Pr/42QfY/oEFs2AWzH/ETP3mX9bnMXWEWAL4CnUGYBqJkym7OP0stiHBGnrybh8nkZsJcBbtb3v0mvbWywHmbmYmEJ9IaMYBcRtRDtzxUO+vFEkfpxTV86bt9AYhahrnGh7ROAoLYLjOQcUEBfQiVKXpxc2QaEF/BEoyLRvd7jWVJhjpYSrw0PBuRieVpI457EFAUxRxrdyuQ5zRQBNYhS6ZG2AxYKyPMgxFBZFhNGN9NIgN6k4cDAg8J8E9N6PAYuZJOMsc/sZc5rg+rq14kpcM17PErGpQEBPmZkXrhOM6hV+Px3INm2A/l4DjGpYs5B5wXKdi12IeSY/h7WSntJjoZIe1V2UW43P2Kh1XpxzEFSOvAZYt5CoAx7V4YzE3JINBGRcWE1aC5UBajODt8fUpBwmHGWWn8sAfIcfbI4vZ5XnzZhYzSFk52p9aDDUYOfqU9rZfT0Btjut1i9nnuS67FnO2ys2rP6PsusU88EecHBVlKH4Ssogky3U4iYLU5I/w8rJbcFyvqXESPh4T03lc1B1qc7yt6e56w+xP1BrTWzBbCZu5Fa8HecRisn6x2m8UTFfDqc/ZDzYoR18NG2Z4kXL0nDueGkTt6R/bVaTSRDLOB6a4b9Gp4AVcoJPCF1P63fFksfm8O1Poj82HXfnM89shdEuIJnPq1XxGNTsC1StTtygWzfAmlakNCTG1qQlaMOLJKb9SIAshUsXCGee88+UOVtQ5J38pxHiwxfh+4oMKlk1/4q5CfKdyr0/ub0NPhxQSqELRexY4maPeJkXxqan13yiyS9vX3PHoIruPzd5DA3zwQ8VwUFzWAkdNvo1QqsOQwYwTTIdwnpArMPSw7jCYlCazBzeJeQh7NFVO3W7UHjcOmrNOzb6X/HTQ5i6jJa3p2Uz7I5MGxOReK2bcpyPvtNOKOdFLcE/ttLublSvwOmrr4CY8bOkA4S3cgpb3xve0hzxre9c033ZbxnynbZkxdPBfzI32t9bM7GwddTIaVPt7/dpf/Bbw7i+Yj4vfUBbMglkwzuc7vDLp6ghnOh4AAAAASUVORK5CYII=","data:image/png;base64,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"
aa2,aa2,aa2,aa2,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAB4CAMAAACJp+2jAAAAPFBMVEW3bA3FfQy8fTPTjQ7NjSjHlFvSl0HgmgTXnDl2q93SnlTYrG31sQ3ZsHrZsoXev5zkzLPs38799/X+//xqrZjvAAACx0lEQVR42u3a0XLjKgwGYIMF4YgiCfH+73pEmtndF/DO0P2Z1OMkF+03kkDgXv/9oHEBAwwwwAADDDDAAAMMMMAAAwwwwAADDDDAAAMMMMAAAwwwwAADzD+OWT9oAPMPY2wu1eV6PkZ8lblE1giPnIxxfzP6vrLt68EYiWhkn+Qbo3HrRc7ERFhmtkCspmN4M+UVr/35gZgchU9mNTC9G3k1rxrAEzHxZ0flNyer0juz0X5n8eF5mCgOI/OICnPvnZS73GY01xQ/DVOi4o10VEuFuNyShDTSbmnV4zCuNWqehLjmlHPiSl1JXZqdlmayU2mHIpWUryul68opgjOozeVPLTgPYVxypJmkLimnr/eIm0I7NDU/lWdPphl1oZTvr8+4r8TKxKelmaiqufEulq9fI969KXM8BHoG44O5NVbhKxCvV/zsAF25cG2N+pxnpdmKwNCdAvNKr/uOS2BSZF6E7Kw0U5ERKyWXnWWvFFG5NyblvX72IaLnYPyD6fwpmZ1o76Ip/MH4YbOZSqedZrtgvjVXumMGOK3RnLNTazXS7PozMlcR7TEx8PCDMFZGzFcxA9TvPLvvz9ScIjAW87auw9IsFs1Yaa7teAfmzoki857rMx9sZ7q5EpXf7cyVgiKunOWsdmY3mtZoSBq/G82SYg8QX5zWaO66aREF0sird1eTK8d+QI34uDTbJaOx1dyhSHIzR75ZHbE5izQrx2Fk7m2z3dJZifchQNfme9u85DTM94GGN1lkPSxSjfa7eeSBxvdRU3WrHpzArGoRqkOPmvZhH2u8rPkY1vYJ4KMHTU8fzxb3HBW/Z2qacRvt9LGY94ITXc2+9rGvD57Nrr/ySCOiEYxZDn+k8dmp+X7YNO3534THgMD8DQz+QwMYYIABBhhggAEGGGCAAQYYYIABBhhggAEGGGCAAQYYYIABBhhgfsz4H6P4gJdGdN0+AAAAAElFTkSuQmCC","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAB4CAMAAACJp+2jAAAAPFBMVEUDAIxIAGcpKZ7/AAD/CBA8P6r/KSpaWrX/QD51dsH/Z2ePjsz/h4ezs93+tbPT0uv/1dT/6+309Pv+//wLMbJyAAAFGklEQVR42u1cgZKjIAzt0lJKKbKF///XQ9QaFRBaYItHZm5nd8aqD/KSR5Le6f6rJpPs5DWsr7mdJ7vpv7D/A0yq5/1irr52pwJ2Od+fgXAiwVCp1GOAcnkoVQaMedQLDkkEhggN5TpAMctVCEzvBDMcgROAwRrK73jt6MglwIxPvAE4HH0IBnGlyTJeNnGyBBjVXRcLaHyNfgSGQt6/bloCjPaHDrq2hzphYAxZJt7PdxQlwJyIXkcQdF4PJ2+BwfPinPcWJ4uZdHBeu8WWOvtgerJMvL+FJ7CkFvgOu2CYlSzOgJLLsIM6NALMKknuh/qM1BH2VyGBYEhEJClg9ogKVtYDBjrqfowvQh1mpc7L551gDJSQEFKWOlxZkyjzggFbeun+lixb6nQXu+vbwbiS5OdkwWmoM77cdRmUbGAWSTIxWZKIBp0uJgYs9CfZgCE5kyRWSfzUlUQ3YLIlSaZvQRXrg1IUfqvR3nvuN2OACGswqhsugRsoqP2Wcb6u/UBo3nEV5a9SRdkKTIRFi/k3xPaXgsHje+EDgZFxYLo4u77AXCM/GRcA5mgSXdAoYZEa/i0h8Y1gdERGxCAhCNW+M6MQlLH8/1owRLOFK3IMMLTPMIIeBAz4WT2Y92vNDUwD08AE2z3OZm12ifxkCTBfqpobmArBeCQOsxsQ4c/uYax7OsHAS4TjjunaY5H1Ejbv16rs6toZUDPP3Y2Jq3HQGQosuwq6AUPBBoIWQrZ6OSODnD4hFrY92PaCz75Aa6toEgh83kORp5OB9Ypy/SpcBe1+X/9buc55ch17rRm6JCgc5ukATLUBGUuWzZs5ugAO/HGliMjgS94ii/EZvNOfwcWog8Yn7d6ZOF6JBHTOwGcXyxCwguwNL9ur2bjIQgN7mnQbzW9dQKEIyfBt4VKF9H8gFCeN/d1mFB8JkCmRk/G3MEDmIRSF8R4GWI7X1R/vHIBlc/1JlOvlFTpQUBHua3pPvJQBuQKSZbOR+xMakDpW2m2WWUglpZIxmWZo3OwnSbie1FaX252doY4kir2EDk+xpK9AMVfUh64BGvk2Tw+aakLMwT5P2ohowhDkq0BZFSXHjoppyLyZgzo+p0jVZV8ryof71sGTgNYk6nWKREp7+cj70zPtEjGjSbZaYruDhLIBD2eUoFRg1oryczCWJOq8pVLJNGmE1o2ba15Tx1Hrl3oTk82l2BRlEjCroH9xZGt0wunGuH5Gwxjv7ra+5me2gN4+2psDYGb65u8GudJKevDzfzFKDgRG8KMg0elIK8WDbM6QgCU+HQbNUbAYlSKPggVLxtRRwjfBw79mzSqWFwfCQviBwHB5IDBSHUfF4ky9lz8xVr+6mDW4AKf/0E7pt51wpRxeHPWKfKhIUaEqjdJ0bPHQsTxsGjKiVkcTw9d8hgIS5ZH1+++LYmurOKrxNRZZ8yljPQJVtUajSyziVLWJBZi6T39s6WeiYjRYbAIAqxULtw0r1rk5xDXMmS/V5ErIiLsnSbN95T+XNCeUMS7Eenek4H1zNZfgyO3CpMy3/Tnpj00sc7mBlkmZRAdKoQTLe0AHwyRZT5u8hJI1D+E0+0A8kgWUrBj8i+ZWM+NMRN7/UaQ/XKLR3fK5M9AaObPya+d5xgMA5q8koIN/NjRo7scJlVWYobRTNfaQOftW3n52X2nMfMigFEqcvMvGNDGz8h85/0ie0PqlYtUeMWyS+UhjJs2aNWvWrFmzZs2aNUts/wAvJe2zUFjgtgAAAABJRU5ErkJggg=="
aa3,aa3,aa3,aa3,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAB4AQMAAACEt4/SAAAABlBMVEXtKTf///+uLhrsAAAAJElEQVRIx+3JIQEAAAgDMPqnpQEUAHG/2VUBhObTSil1F0BoAV8mCdWFYT45AAAAAElFTkSuQmCC","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAB4BAMAAABMVwCiAAAAGFBMVEXeCCXgKzznTVvtgYr0sbf71tn85+r+//zIijK0AAAAt0lEQVRo3u3WQRGDQBAF0ZGwEpAQLKwFJICEwLePAigKSB9SPQb6Mjv7KoezjfXe5GQmJpNlQDJZRySTdCaTqSGZfAck88pm58p0JpOlIZmsHySTrSOZIJmnW32tMre/WWjmeTLHhjmdyEfAfGtzKyDTq36fgQCl03SaTtNpOk2n6TSdptN0mk7TaTpNp+k0nabTdJpO02k6TafpNJ2m03SaTtNpOk2n6TSdptN0mk7TaTpNp92eHQvvhFficCLKAAAAAElFTkSuQmCC"
aa4,aa4,aa4,aa4,"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAB4BAMAAABMVwCiAAAAHlBMVEX3JC8An1L5ZiM2qUL6fyBmszWYvSv6pxXLxhv50QmKstc6AAABLUlEQVRo3u3Ur6vCUBjG8SGDYTzIhjbrjbe5tmo0GhdtNjGK6bbrDzbf/9Yd9bBp8h08LyLPNygL+oGzZ4sixhhjjDHGGGOMsbcbTE2YuDBhkrUJM/w3YeZnE2ZbmzAiJnsWsVh0ImIxtaGIxdR+RI4WQxOpTYZmMbWBZ6YWQ0NOLd7c23qmflwUkIW9dgRN7DnM4OJXpoA9mL2PzCladZVK80sVk3aZBYxxs1bZOxzTHlvlkEza68jUzCgwv1AmC0wJZSaBOUCZPDAn9wVL88Llz38imdvQykw/tUg9tOauLNVT0zHj5sj8d3NsOyCTPx7/VDu1SDm0fXiHVkCm/fOV4JhR+8ZMdVNTMVnnhuQljulelMC3QN/IkCFDhgwZMmTIkCFDhgwZMh/IXAHTxjBzFTr+VAAAAABJRU5ErkJggg==","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAAB4CAMAAACJp+2jAAAAeFBMVEU8AQAZFRQaF5V4ERCwCQk+IYX0AB3+AAD/ACOTHkqyGT9aL3p7Kmb2DzRNQEroHCN1PTJIWbb8NU8te4RadE0AhbN3ei0Aldz/WnCajRSEg8L1eIPWlK5htub/lZr7lafUvQ+Sv+L/qaq2xNz/s7P/usP92Nr+//z23RRkAAADtUlEQVR42u3abY+jIBAA4C715bTSrtYqiorWav//PzxA0b3cdbvNwQbvZj64ycREnjIMkOzO+4diBxjAAAYwgAEMYAADGMAABjC6A+ONYz4Akr5PvgNmDIOrks3DJnWe12ROs7LCm8NUCKFSChi3cA2TrpKnq41glmpiLh81cqsEV/kcFU6qKct+e91GDKk7JgdIYzRF3OdL9EuSSgnrVPHZiMGdqKeOYcKH7UZB6Hh+eUmL9JKLR4lUxASzXlRfh63FqIqqo8Dx5ygvRVGc5SNeMKiU6+jMa89WTFKrggp8f8W0bXs+i0eMjo6zP4h1I17iwDSvE0sxYnmkacqfpWCcwiA6uLHAXOQjdtv2eNihGZMVRcYXkp0YKixygHnuBAe1PPJzxstJPGKUtTx9mDF5kQk4tRIj+xbHXPifdXnEazdzOaYtsuNxTl6mHmftzOTnVA5xwoiGFk7zJeYAoaIVkaKuW5aXpTMjG/MyC0HoTR1ArI62zSQmlRiECLndZ4/O5qyzAbAPmLWdidrj1TVhMpf3aIT8veMnzV3omaXdDKvaqS/5SUI8JwxE7fHSEhj3/fh+yFxU+s5ut3dOydBr3TWNbJq8FQSnMJIHMdm4zudczgyPQ4RQ3ySO8/725uxP1m6aYtfkS7u712rkCjPFmuLvXInv8FpLrMWI7lzPnWoetxvXPCOirmP3g094El/vbUDzqXmdhtiNy4qRZL1YYpwQVpXxsvXU/WjxqdnzVHfmR2fyYGljUi27TO/ZjKHTL06f9ChM5QVA54ZpAIO755LV02GrMR59YRUQzRPj7e5a40qbF4Je9X5dN2Ykc1CVGlRmUBmqMqPtmB9zJCrVqAxTmURlAAMYwAAGMID5awzbMGbZ+NWIicqQxaAygAEMYAADGMD81ximYrk/X+dYbsvLK3A2AwxgAAMYwLwWt1cweLxZjRkG/AJmGKzGjLdhjuvjE8BVvXMbrcbcm1fOZs3dbgx9BUMB832YZRl8AaO7mWnHLL/2FzC6JwYwnzfn61cx19F6jPq9n2O0T4wBzNh8DdOM+jFIe0Qjfn6cwWOk/8sGMCgUms8xeAzRNjCIDs8wA0VbwbjNgD/D4KFxN4NBLh3IYwwZqBGLIQzXjI8xoyGLKQxCwfgIMwamvmkMg6Lmz5gmQtvDKM6vGIMUsxjOoTd+IpD3Zcp3/BuNjH7OLEZ4gvmfA2kQmf6Wccx3BmAAAxjAAAYwgAEMYAADGMAABjCAAQxgAAMYwAAGMH8bPwGglL8FvugtkQAAAABJRU5ErkJggg=="
`;



const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        const obj = headers.reduce((acc, header, index) => {
            acc[header] = values[index].replace(/^"|"$/g, ''); // Remove surrounding quotes
            return acc;
        }, {});
        return obj;
    });
};
const iterate = (data) => {
    var i = 0;
    setInterval(() => {
        inAnimation();
        const firstObject = data[i];
        let xml = '';
        Object.entries(firstObject).forEach(([key, value]) => {
            xml += `<componentData id="${key}"><data id="text" value="${value}" /></componentData>`;
        });
        xml = `<templateData>${xml}</templateData>`;
        update(xml);
        i++;
        if (i > data.length - 1) {
            i = 0;
        }
    }, 4000);
}

scriptgsap.onload = function () {
    // fetchCSV('csv.txt').then(data1 => {
    //     const data = parseCSV(data1);
    //     if (data.length > 0) {
    //         iterate(data)
    //     }
    // }
    // );


    const data = parseCSV(csvContent);
         if (data.length > 0) {
            iterate(data)
        }

};
