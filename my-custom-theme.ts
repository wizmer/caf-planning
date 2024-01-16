
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
    name: 'my-custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "9999px",
		"--theme-rounded-container": "8px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "0 0 0",
		"--on-secondary": "0 0 0",
		"--on-tertiary": "255 255 255",
		"--on-success": "255 255 255",
		"--on-warning": "255 255 255",
		"--on-error": "0 0 0",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #a99468
		"--color-primary-50": "242 239 232", // #f2efe8
		"--color-primary-100": "238 234 225", // #eeeae1
		"--color-primary-200": "234 228 217", // #eae4d9
		"--color-primary-300": "221 212 195", // #ddd4c3
		"--color-primary-400": "195 180 149", // #c3b495
		"--color-primary-500": "169 148 104", // #a99468
		"--color-primary-600": "152 133 94", // #98855e
		"--color-primary-700": "127 111 78", // #7f6f4e
		"--color-primary-800": "101 89 62", // #65593e
		"--color-primary-900": "83 73 51", // #534933
		// secondary | #1afa5e
		"--color-secondary-50": "221 254 231", // #ddfee7
		"--color-secondary-100": "209 254 223", // #d1fedf
		"--color-secondary-200": "198 254 215", // #c6fed7
		"--color-secondary-300": "163 253 191", // #a3fdbf
		"--color-secondary-400": "95 252 142", // #5ffc8e
		"--color-secondary-500": "26 250 94", // #1afa5e
		"--color-secondary-600": "23 225 85", // #17e155
		"--color-secondary-700": "20 188 71", // #14bc47
		"--color-secondary-800": "16 150 56", // #109638
		"--color-secondary-900": "13 123 46", // #0d7b2e
		// tertiary | #b85619
		"--color-tertiary-50": "244 230 221", // #f4e6dd
		"--color-tertiary-100": "241 221 209", // #f1ddd1
		"--color-tertiary-200": "237 213 198", // #edd5c6
		"--color-tertiary-300": "227 187 163", // #e3bba3
		"--color-tertiary-400": "205 137 94", // #cd895e
		"--color-tertiary-500": "184 86 25", // #b85619
		"--color-tertiary-600": "166 77 23", // #a64d17
		"--color-tertiary-700": "138 65 19", // #8a4113
		"--color-tertiary-800": "110 52 15", // #6e340f
		"--color-tertiary-900": "90 42 12", // #5a2a0c
		// success | #1558ac
		"--color-success-50": "220 230 243", // #dce6f3
		"--color-success-100": "208 222 238", // #d0deee
		"--color-success-200": "197 213 234", // #c5d5ea
		"--color-success-300": "161 188 222", // #a1bcde
		"--color-success-400": "91 138 197", // #5b8ac5
		"--color-success-500": "21 88 172", // #1558ac
		"--color-success-600": "19 79 155", // #134f9b
		"--color-success-700": "16 66 129", // #104281
		"--color-success-800": "13 53 103", // #0d3567
		"--color-success-900": "10 43 84", // #0a2b54
		// warning | #8944f6
		"--color-warning-50": "237 227 254", // #ede3fe
		"--color-warning-100": "231 218 253", // #e7dafd
		"--color-warning-200": "226 208 253", // #e2d0fd
		"--color-warning-300": "208 180 251", // #d0b4fb
		"--color-warning-400": "172 124 249", // #ac7cf9
		"--color-warning-500": "137 68 246", // #8944f6
		"--color-warning-600": "123 61 221", // #7b3ddd
		"--color-warning-700": "103 51 185", // #6733b9
		"--color-warning-800": "82 41 148", // #522994
		"--color-warning-900": "67 33 121", // #432179
		// error | #6dafd2
		"--color-error-50": "233 243 248", // #e9f3f8
		"--color-error-100": "226 239 246", // #e2eff6
		"--color-error-200": "219 235 244", // #dbebf4
		"--color-error-300": "197 223 237", // #c5dfed
		"--color-error-400": "153 199 224", // #99c7e0
		"--color-error-500": "109 175 210", // #6dafd2
		"--color-error-600": "98 158 189", // #629ebd
		"--color-error-700": "82 131 158", // #52839e
		"--color-error-800": "65 105 126", // #41697e
		"--color-error-900": "53 86 103", // #355667
		// surface | #5c6aac
		"--color-surface-50": "231 233 243", // #e7e9f3
		"--color-surface-100": "222 225 238", // #dee1ee
		"--color-surface-200": "214 218 234", // #d6daea
		"--color-surface-300": "190 195 222", // #bec3de
		"--color-surface-400": "141 151 197", // #8d97c5
		"--color-surface-500": "92 106 172", // #5c6aac
		"--color-surface-600": "83 95 155", // #535f9b
		"--color-surface-700": "69 80 129", // #455081
		"--color-surface-800": "55 64 103", // #374067
		"--color-surface-900": "45 52 84", // #2d3454

	}
}
