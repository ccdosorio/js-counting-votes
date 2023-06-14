get = async (url) => {
    try {
        let req = await fetch(url);
        let json = await req.json();

        return json;
    } catch (err) {
        console.log("http get method err", err);

        throw Error(err);
    }
};

post = async (url, form) => {
    try {
        let options = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            redirect: "follow",
            referrer: "no-referrer",
        };

        if (form) {
            options.body = JSON.stringify(form);
        }

        let req = await fetch(url, options);

        let json = await req.json();

        return json;
    } catch (err) {
        console.log("http post method err", err);

        throw Error(err);
    }
};
