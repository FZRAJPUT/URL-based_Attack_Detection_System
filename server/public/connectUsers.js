// const checkAttack = async (username, input) => {
//     const input1 = document.getElementById(input).value;

//     const res = await fetch(
//         "http://localhost:5000/api/attacks/analyze",
//         {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ url: input1, user: username })
//         }
//     );

//     const data = await res.json();
//     // if(data.attack.status !== "Safe"){
//     //     alert("Attempted : " +data.attack.attack_type)
//     // }
//     console.log(data);
// }


const checkAttack = async (email, ...inputs) => {
    const inputValues = inputs.map(id => document.getElementById(id).value);

    try {
        const res = await fetch("http://localhost:5000/api/attacks/analyze",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ urls: inputValues, email })
            }
        );
        const data = await res.json();
        console.log(data);
    } catch (error) {
        console.error("Error analyzing inputs:", error.message);
    }
}
