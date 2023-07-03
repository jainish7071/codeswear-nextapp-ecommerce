export default function handler(req, res) {
    let pincodes = {
        "410017": ["Pune", "Maharastra"],
        "400097": ["Ahmedabad", "Gujarat"],
        "365635": ["Amreli", "Gujarat"],
    }
    res.status(200).json(pincodes);
}
