class Route36 {
    static ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    static BASE = 36n;

    static ipToInt(ip) {
        const parts = ip.split('.').map(Number);

        if (
            parts.length !== 4 ||
            parts.some(n => !Number.isInteger(n) || n < 0 || n > 255)
        ) {
            throw new Error("Invalid IPv4 address");
        }

        return (
            (BigInt(parts[0]) << 24n) |
            (BigInt(parts[1]) << 16n) |
            (BigInt(parts[2]) << 8n) |
            BigInt(parts[3])
        );
    }

    static intToIp(value) {
        return [
            Number((value >> 24n) & 255n),
            Number((value >> 16n) & 255n),
            Number((value >> 8n) & 255n),
            Number(value & 255n)
        ].join(".");
    }

    static encode(endpoint) {
        if (!endpoint.startsWith("http://")) {
            throw new Error("Only http:// URLs are supported");
        }

        const body = endpoint.slice(7);

        const idx = body.lastIndexOf(":");

        if (idx === -1) {
            throw new Error("Expected format: http://IP:PORT");
        }

        const ip = body.slice(0, idx);
        const port = Number(body.slice(idx + 1));

        if (
            !Number.isInteger(port) ||
            port < 0 ||
            port > 65535
        ) {
            throw new Error("Port must be between 0 and 65535");
        }

        const ipInt = this.ipToInt(ip);

        let value = (ipInt << 16n) | BigInt(port);

        if (value === 0n) {
            return this.ALPHABET[0];
        }

        let result = "";

        while (value > 0n) {
            const rem = Number(value % this.BASE);
            result = this.ALPHABET[rem] + result;
            value /= this.BASE;
        }

        return result;
    }

    static decode(code) {
        let value = 0n;

        for (const ch of code) {
            const idx = this.ALPHABET.indexOf(ch);

            if (idx === -1) {
                throw new Error(`Invalid character: ${ch}`);
            }

            value = value * this.BASE + BigInt(idx);
        }

        const port = Number(value & 0xFFFFn);
        const ipInt = value >> 16n;

        const ip = this.intToIp(ipInt);

        return `http://${ip}:${port}`;
    }
}

if (typeof window !== 'undefined') {
    window.Route36 = Route36;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Route36;
}


// Example

// const endpoint = "http://10.227.9.50:5000";

// const code = Route36.encode(endpoint);

// console.log("Encoded:", code);

// const decoded = Route36.decode(code);

// console.log("Decoded:", decoded);