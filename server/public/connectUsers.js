const checkAttack = async (email, ...inputs) => {
    const inputValues = inputs.map(id => document.getElementById(id).value);

    try {
        const res = await fetch(process.env.MY_API,
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
