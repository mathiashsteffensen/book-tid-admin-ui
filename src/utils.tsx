import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import weekOfYear from "dayjs/plugin/weekOfYear"
dayjs.extend(weekOfYear)
dayjs.extend(utc)

function getSettingLabelFromKey(
    key: string
): {
    title: string
    subtitle: string
} | void {
    switch (key) {
        case "personalDataPolicy":
            return {
                title: "Persondatapolitik & samtykkeerklæring",
                subtitle: `
                    Din persondatapolitik og samtykkeerklæring som kunden skal godkende inden booking.

                    Beskriver kundernes rettigheder mht. de data du gemmer om kunderne.
                `,
            }
        case "latestBookingBefore":
            return {
                title: "Senest booking før",
                subtitle: "Minimum tid før ankomst en kunde kan booke online.",
            }
        case "latestCancelbefore":
            return {
                title: "Senest tid for afbestilling af booking",
                subtitle:
                    "Minimum tid en kunde skal kunne afbestille, før den bookede tid. Ellers skal der ringes for at afbestille.",
            }
        case "maxDaysBookAhead":
            return {
                title: "Max dage frem i tid der kan bookes",
                subtitle:
                    "Max antal dage frem i tiden, en kunde har lov til at lave en booking.",
            }
        case "requireCustomerAddress":
            return {
                title: "Kunde skal indtaste sin adresse ved online booking",
                subtitle:
                    "Det kunne f.eks være hvis servicen leveres hjemme hos kunden.",
            }
        case "hideCustomerCommentSection":
            return {
                title: "Skjul kommentar felt ved online booking",
                subtitle: "Kan bruges til at videre give en information.",
            }
        case "hideServiceDuration":
            return {
                title: "Skjul service varighed for kunden",
                subtitle:
                    "Gør at kunden ikke kan se hvor lang tid en service tager at udføre.",
            }
        case "hideServicePrice":
            return {
                title: "Skjul service pris for kunden",
                subtitle:
                    "Gør at kunden ikke kan se hvor meget en service koster.",
            }
        case "hideContactInfo":
            return {
                title: "Skjul kontakt information ved onlinebooking",
                subtitle:
                    "Gør at kunden ikke kan se dine kontakt informationer. Dette skjuler navn, firmaaddresse, email og telefonnummer på din bookingside.",
            }
        case "hideGoogleMaps":
            return {
                title: "Skjul Google Maps",
                subtitle:
                    "Skjuler Google Maps på booking siden. OBS: Hvis du vil vise Google Maps er det vigtigt at du ikke har valgt at skjule dine kontakt informationer",
            }
        case "domainPrefix":
            return {
                title: "Booking link",
                subtitle: "Link hvor dine kunder kan booke tid.",
            }
    }
}

function createBookingDomainPrefix(companyName) {
    return companyName
        .split(" ")
        .join("")
        .toLowerCase()
        .replace(/ø/g, "oe")
        .replace(/æ/g, "ae")
        .replace(/å/g, "aa")
        .replace(/[.]/g, "dot")
        .replace(/\//g, "slash")
        .replace(/#/g, "pound")
        .replace(/[?]/g, "question")
        .replace(/=/g, "equals")
}

const renderTextWithBreaks = (fullText: string, unsafe: boolean = false) => {
    if (unsafe)
        return fullText
            .split("\n")
            .map((text: string, i: number) => (
                <p
                    dangerouslySetInnerHTML={{ __html: text }}
                    style={{ minHeight: 18, margin: 0 }}
                    key={i}
                ></p>
            ))

    return fullText.split("\n").map((text: string, i: number) => (
        <p style={{ minHeight: 18, margin: 0 }} key={i}>
            {text}
        </p>
    ))
}

// Frequently asked questions and their answers
// TODO: Maybe consider moving to markdown format? Easier to write more content
const FAQs: Array<{
    q: string
    a: string
}> = [
    {
        q: "Hvordan kan jeg integrere min bookingside på min egen hjemmeside?",
        a: `Det er muligt at integrere det på jeres egen hjemmeside gennem det der hedder et iframe tag.
            
        Det kræver blot adgang til at ændre koden på jeres site, lidt viden om HTML vil hjælpe men er ikke påkrævet.
        
        Et iframe tag vil i praksis se sådan her ud:
        
        <pre><code><div class="html-tag">&lt;<p>iframe</p> <div class="html-attribute"><div class="html-attribute-name"> src</div>=<div class="html-attribute-value" >"https://eksempel.booktid.net"</div></div><div class="html-attribute"><div class="html-attribute-name"> width</div>=<div class="html-attribute-value">"100%"</div></div> <div class="html-attribute"><div class="html-attribute-name"> height</div>=<div class="html-attribute-value">"775"</div></div><div class="html-attribute"><div class="html-attribute-name"> frameborder</div>=<div class="html-attribute-value">"0"</div></div>&gt;</div>    <div class="html-tag">&lt;/<p>iframe</p>&gt;</div></code></pre>
        
        Læg specielt mærke til der hvor der står ' src="https://eksempel.booktid.net" '. Det er her vigtigt at ændre til linket til jeres egen bookingside.
        
        Efter linket er ændret til jeres egen hjemmeside kan i kopiere jeres iframe tag ind på jeres hjemmesides HTML kode hvor i vil vise bookingsiden.
        
        Du kan læse mere om iframe tagget og hvad der kan gøres med det <a target="_blank" rel="norefferer" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe" class="link">her</a>`,
    },
]

export {
    getSettingLabelFromKey,
    createBookingDomainPrefix,
    renderTextWithBreaks,
    FAQs,
}
