import path from "node:path"
import { fileURLToPath } from "node:url"

import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

const config = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            "import/order": [
                "warn",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                        "object",
                        "type",
                    ],
                    alphabetize: {
                        order: "asc",
                    },
                    "newlines-between": "always",
                },
            ],
            "react-hooks/exhaustive-deps": "off",
        },
    },
]
export default config
