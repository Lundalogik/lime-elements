/* eslint-disable prettier/prettier */

/*
 * To be able to use colors with alpha, they are written in RGB.
 * Comments with HEX codes in front of the values are used as reference only.
 * Example of use:
 * solid: `color: rgb(var(--contrast-100))`
 * transparent: `color: rgba(var(--contrast-100), 0.5)`
 */

export const root = {
    /* Lime Technologies Brand Colors (Do not have dark/light mode variants) */
    'lime-brand-color-deep-red': {red: 240, green: 87, blue: 80}, /* #f05750 */
    'lime-brand-color-sellable-orange': {red: 255, green: 112, blue: 67}, /* #ff7043 (FIXME: or 247-107-7; // #f76b07 ? --> can be replaced with orange-dark in light mode in this case) */
    'lime-brand-color-orange': {red: 255, green: 176, blue: 59}, /* #ffb03b */
    'lime-brand-color-yellow': {red: 255, green: 207, blue: 61}, /* #ffcf3d */
    'lime-brand-color-lime-green': {red: 102, green: 187, blue: 106}, /* #66bb6a (FIXME: or 133-196-54; // #85c436 ? --> can be replaced with lime-default in light mode in this case) */
    'lime-brand-color-flexible-turquoise': {red: 38, green: 166, blue: 154}, /* #26a69a (FIXME: or 0-179-167; // #00b3a7 ? --> needs modifying the teal hues in this case) */
    'lime-brand-color-simple-blue': {red: 41, green: 182, blue: 246}, /* #29b6f6 (FIXME: or 0-183-255; // #00b7ff ? --> can be replaced with sky-light in dark mode in this case) */
    'lime-brand-color-dark-blue': {red: 87, green: 135, blue: 159}, /* #57879f */
    'lime-brand-color-loving-magenta': {red: 255, green: 49, blue: 149}, /* #ff3195 */
    'lime-brand-color-light-grey': {red: 173, green: 173, blue: 173}, /* #adadad */
    'lime-brand-color-grey': {red: 87, green: 87, blue: 86}, /* #575756 */

    /* Absolute white and black (Do not have dark/light mode variants) */
    'color-white': {red: 255, green: 255, blue: 255}, /* #fff */
    'color-black': {red: 0, green: 0, blue: 0}, /* #000 */

    /* Contrast swatches, to use for tones that can automatically revert in dark/light modes. E.g. text and background */
    'contrast-100': {red: 255, green: 255, blue: 255}, /* #fff */
    'contrast-200': {red: 250, green: 250, blue: 251}, /* #fafafb */
    'contrast-300': {red: 246, green: 246, blue: 247}, /* #f6f6f7 */
    'contrast-400': {red: 241, green: 241, blue: 243}, /* #f1f1f3 */
    'contrast-500': {red: 237, green: 237, blue: 238}, /* #ededee */
    'contrast-600': {red: 232, green: 232, blue: 234}, /* #e8e8ea */
    'contrast-700': {red: 209, green: 209, blue: 213}, /* #d1d1d5 */
    'contrast-800': {red: 186, green: 186, blue: 192}, /* #babac0 */
    'contrast-900': {red: 140, green: 140, blue: 150}, /* #8c8c96 */
    'contrast-1000': {red: 117, green: 117, blue: 128}, /* #757580 */
    'contrast-1100': {red: 94, green: 94, blue: 108}, /* #5e5e6c */
    'contrast-1200': {red: 71, green: 71, blue: 86}, /* #474756 */
    'contrast-1300': {red: 48, green: 48, blue: 66}, /* #303042 */
    'contrast-1400': {red: 39, green: 39, blue: 57}, /* #272739 */
    'contrast-1500': {red: 35, green: 35, blue: 53}, /* #232335 */
    'contrast-1600': {red: 25, green: 25, blue: 44}, /* #19192c */
    'contrast-1700': {red: 0, green: 0, blue: 0}, /* #000 */

    /* Colors swatches that get slightly dimmer in dark mode */
    'color-red-lighter': {red: 255, green: 205, blue: 210}, /* #ffcdd2; */
    'color-red-light': {red: 255, green: 117, blue: 107}, /* #ff756b; */
    'color-red-default': {red: 244, green: 67, blue: 54}, /* #f44336; */
    'color-red-dark': {red: 211, green: 47, blue: 47}, /* #d32f2f; */
    'color-red-darker': {red: 183, green: 28, blue: 28}, /* #b71c1c; */

    'color-pink-lighter': {red: 248, green: 187, blue: 208}, /* #f8bbd0 */
    'color-pink-light': {red: 240, green: 98, blue: 146}, /* #f06292 */
    'color-pink-default': {red: 233, green: 30, blue: 99}, /* #e91e63 */
    'color-pink-dark': {red: 194, green: 24, blue: 91}, /* #c2185b */
    'color-pink-darker': {red: 136, green: 14, blue: 79}, /* #880e4f */

    'color-purple-lighter': {red: 225, green: 190, blue: 231}, /* #e1bee7 */
    'color-purple-light': {red: 186, green: 104, blue: 200}, /* #ba68c8 */
    'color-purple-default': {red: 156, green: 39, blue: 176}, /* #9c27b0 */
    'color-purple-dark': {red: 123, green: 31, blue: 162}, /* #7b1fa2 */
    'color-purple-darker': {red: 74, green: 20, blue: 140}, /* #4a148c */

    'color-magenta-lighter': {red: 249, green: 176, blue: 212}, /* #f9b0d4 */
    'color-magenta-light': {red: 247, green: 89, blue: 166}, /* #f759a6 */
    'color-magenta-default': {red: 243, green: 65, blue: 151}, /* #f34197 */
    'color-magenta-dark': {red: 199, green: 46, blue: 121}, /* #c72e79 */
    'color-magenta-darker': {red: 156, green: 22, blue: 87}, /* #9c1657 */

    'color-violet-lighter': {red: 209, green: 196, blue: 233}, /* #d1c4e9 */
    'color-violet-light': {red: 149, green: 117, blue: 205}, /* #9575cd */
    'color-violet-default': {red: 103, green: 58, blue: 183}, /* #673ab7 */
    'color-violet-dark': {red: 81, green: 45, blue: 168}, /* #512da8 */
    'color-violet-darker': {red: 49, green: 27, blue: 146}, /* #311b92 */

    'color-indigo-lighter': {red: 197, green: 202, blue: 233}, /* #c5cae9 */
    'color-indigo-light': {red: 121, green: 134, blue: 203}, /* #7986cb */
    'color-indigo-default': {red: 63, green: 81, blue: 181}, /* #3f51b5 */
    'color-indigo-dark': {red: 48, green: 63, blue: 159}, /* #303f9f */
    'color-indigo-darker': {red: 26, green: 35, blue: 126}, /* #1a237e */

    'color-blue-lighter': {red: 187, green: 222, blue: 251}, /* #bbdefb */
    'color-blue-light': {red: 100, green: 181, blue: 246}, /* #64b5f6 */
    'color-blue-default': {red: 33, green: 150, blue: 243}, /* #2196f3 */
    'color-blue-dark': {red: 25, green: 118, blue: 210}, /* #1976d2 */
    'color-blue-darker': {red: 13, green: 71, blue: 161}, /* #0d47a1 */

    'color-sky-lighter': {red: 179, green: 229, blue: 252}, /* #b3e5fc */
    'color-sky-light': {red: 79, green: 195, blue: 247}, /* #4fc3f7 */
    'color-sky-default': {red: 3, green: 169, blue: 244}, /* #03a9f4 */
    'color-sky-dark': {red: 2, green: 136, blue: 209}, /* #0288d1 */
    'color-sky-darker': {red: 1, green: 87, blue: 155}, /* #01579b */

    'color-cyan-lighter': {red: 178, green: 235, blue: 242}, /* #b2ebf2 */
    'color-cyan-light': {red: 77, green: 208, blue: 225}, /* #4dd0e1 */
    'color-cyan-default': {red: 0, green: 188, blue: 212}, /* #00bcd4 */
    'color-cyan-dark': {red: 0, green: 151, blue: 167}, /* #0097a7 */
    'color-cyan-darker': {red: 0, green: 96, blue: 100}, /* #006064 */

    'color-teal-lighter': {red: 178, green: 223, blue: 219}, /* #b2dfdb */
    'color-teal-light': {red: 77, green: 182, blue: 172}, /* #4db6ac */
    'color-teal-default': {red: 0, green: 150, blue: 136}, /* #009688 */
    'color-teal-dark': {red: 0, green: 121, blue: 107}, /* #00796b */
    'color-teal-darker': {red: 0, green: 77, blue: 64}, /* #004d40 */

    'color-green-lighter': {red: 200, green: 230, blue: 201}, /* #c8e6c9 */
    'color-green-light': {red: 129, green: 199, blue: 132}, /* #81c784 */
    'color-green-default': {red: 76, green: 175, blue: 80}, /* #4caf50 */
    'color-green-dark': {red: 56, green: 142, blue: 60}, /* #388e3c */
    'color-green-darker': {red: 27, green: 94, blue: 32}, /* #1b5e20 */

    'color-lime-lighter': {red: 220, green: 237, blue: 200}, /* #dcedc8 */
    'color-lime-light': {red: 174, green: 213, blue: 129}, /* #aed581 */
    'color-lime-default': {red: 139, green: 195, blue: 74}, /* #8bc34a */
    'color-lime-dark': {red: 104, green: 159, blue: 56}, /* #689f38 */
    'color-lime-darker': {red: 51, green: 105, blue: 30}, /* #33691e */

    'color-grass-lighter': {red: 240, green: 244, blue: 195}, /* #f0f4c3 */
    'color-grass-light': {red: 220, green: 231, blue: 117}, /* #dce775 */
    'color-grass-default': {red: 205, green: 220, blue: 57}, /* #cddc39 */
    'color-grass-dark': {red: 175, green: 180, blue: 43}, /* #afb42b */
    'color-grass-darker': {red: 130, green: 119, blue: 23}, /* #827717 */

    'color-yellow-lighter': {red: 255, green: 249, blue: 196}, /* #fff9c4 */
    'color-yellow-light': {red: 255, green: 241, blue: 118}, /* #fff176 */
    'color-yellow-default': {red: 255, green: 235, blue: 59}, /* #ffeb3b */
    'color-yellow-dark': {red: 251, green: 206, blue: 44}, /* #fbce2c */
    'color-yellow-darker': {red: 232, green: 191, blue: 41}, /* #e8bf29 */

    'color-amber-lighter': {red: 255, green: 236, blue: 179}, /* #ffecb3 */
    'color-amber-light': {red: 255, green: 213, blue: 79}, /* #ffd54f */
    'color-amber-default': {red: 255, green: 193, blue: 7}, /* #ffc107 */
    'color-amber-dark': {red: 255, green: 160, blue: 0}, /* #ffa000 */
    'color-amber-darker': {red: 255, green: 111, blue: 0}, /* #ff6f00 */

    'color-orange-lighter': {red: 255, green: 224, blue: 178}, /* #ffe0b2 */
    'color-orange-light': {red: 255, green: 183, blue: 77}, /* #ffb74d */
    'color-orange-default': {red: 255, green: 152, blue: 0}, /* #ff9800 */
    'color-orange-dark': {red: 245, green: 124, blue: 0}, /* #f57c00 */
    'color-orange-darker': {red: 230, green: 81, blue: 0}, /* #e65100 */

    'color-coral-lighter': {red: 255, green: 204, blue: 188}, /* #ffccbc */
    'color-coral-light': {red: 255, green: 138, blue: 101}, /* #ff8a65 */
    'color-coral-default': {red: 255, green: 87, blue: 34}, /* #ff5722 */
    'color-coral-dark': {red: 230, green: 74, blue: 25}, /* #e64a19 */
    'color-coral-darker': {red: 191, green: 54, blue: 12}, /* #bf360c */

    'color-brown-lighter': {red: 215, green: 204, blue: 200}, /* #d7ccc8 */
    'color-brown-light': {red: 161, green: 136, blue: 127}, /* #a1887f */
    'color-brown-default': {red: 121, green: 85, blue: 72}, /* #795548 */
    'color-brown-dark': {red: 93, green: 64, blue: 55}, /* #5d4037 */
    'color-brown-darker': {red: 62, green: 39, blue: 35}, /* #3e2723 */

    'color-gray-lighter': {red: 245, green: 245, blue: 245}, /* #f5f5f5 */
    'color-gray-light': {red: 224, green: 224, blue: 224}, /* #e0e0e0 */
    'color-gray-default': {red: 158, green: 158, blue: 158}, /* #9e9e9e */
    'color-gray-dark': 'lime-brand-color-grey',
    'color-gray-darker': {red: 33, green: 33, blue: 33}, /* #212121 */

    'color-glaucous-lighter': {red: 208, green: 225, blue: 232}, /* #d0e1e8 */
    'color-glaucous-light': {red: 135, green: 174, blue: 193}, /* #87aec1 */
    'color-glaucous-default': 'lime-brand-color-dark-blue',
    'color-glaucous-dark': {red: 58, green: 100, blue: 119}, /* #3a6477 */
    'color-glaucous-darker': {red: 37, green: 71, blue: 88}, /* #254758 */
};

export const dark = {
    'contrast-100': {red: 0, green: 0, blue: 0}, /* #000 */
    'contrast-200': {red: 25, green: 25, blue: 44}, /* #19192c */
    'contrast-300': {red: 35, green: 35, blue: 53}, /* #232335 */
    'contrast-400': {red: 39, green: 39, blue: 57}, /* #272739 */
    'contrast-500': {red: 48, green: 48, blue: 66}, /* #303042 */
    'contrast-600': {red: 71, green: 71, blue: 86}, /* #474756 */
    'contrast-700': {red: 94, green: 94, blue: 108}, /* #5e5e6c */
    'contrast-800': {red: 117, green: 117, blue: 128}, /* #757580 */
    'contrast-900': {red: 140, green: 140, blue: 150}, /* #8c8c96 */
    'contrast-1000': {red: 186, green: 186, blue: 192}, /* #babac0 */
    'contrast-1100': {red: 209, green: 209, blue: 213}, /* #d1d1d5 */
    'contrast-1200': {red: 232, green: 232, blue: 234}, /* #e8e8ea */
    'contrast-1300': {red: 237, green: 237, blue: 238}, /* #ededee */
    'contrast-1400': {red: 241, green: 241, blue: 243}, /* #f1f1f3 */
    'contrast-1500': {red: 246, green: 246, blue: 247}, /* #f6f6f7 */
    'contrast-1600': {red: 250, green: 250, blue: 251}, /* #fafafb */
    'contrast-1700': {red: 255, green: 255, blue: 255}, /* #fff */

    'color-red-lighter': {red: 239, green: 154, blue: 154}, /* #ef9a9a */
    'color-red-light': 'lime-brand-color-deep-red',
    'color-red-default': {red: 229, green: 57, blue: 53}, /* #e53935 */
    'color-red-dark': {red: 198, green: 40, blue: 40}, /* #c62828 */
    'color-red-darker': {red: 165, green: 23, blue: 23}, /* #a51717 */

    'color-pink-lighter': {red: 244, green: 143, blue: 177}, /* #f48fb1 */
    'color-pink-light': {red: 236, green: 64, blue: 122}, /* #ec407a */
    'color-pink-default': {red: 216, green: 27, blue: 96}, /* #d81b60 */
    'color-pink-dark': {red: 173, green: 20, blue: 87}, /* #ad1457 */
    'color-pink-darker': {red: 132, green: 10, blue: 75}, /* #840a4b */

    'color-magenta-lighter': {red: 249, green: 161, blue: 204}, /* #f9a1cc */
    'color-magenta-light': {red: 249, green: 79, blue: 162}, /* #f94fa2 */
    'color-magenta-default': 'lime-brand-color-loving-magenta',
    'color-magenta-dark': {red: 208, green: 31, blue: 117}, /* #d01f75 */
    'color-magenta-darker': {red: 156, green: 22, blue: 87}, /* #9c1657 */

    'color-purple-lighter': {red: 206, green: 147, blue: 216}, /* #ce93d8 */
    'color-purple-light': {red: 171, green: 71, blue: 188}, /* #ab47bc */
    'color-purple-default': {red: 142, green: 36, blue: 170}, /* #8e24aa */
    'color-purple-dark': {red: 106, green: 27, blue: 154}, /* #6a1b9a */
    'color-purple-darker': {red: 62, green: 13, blue: 121}, /* #3e0d79 */

    'color-violet-lighter': {red: 179, green: 157, blue: 219}, /* #b39ddb */
    'color-violet-light': {red: 126, green: 87, blue: 194}, /* #7e57c2 */
    'color-violet-default': {red: 94, green: 53, blue: 177}, /* #5e35b1 */
    'color-violet-dark': {red: 69, green: 39, blue: 160}, /* #4527a0 */
    'color-violet-darker': {red: 41, green: 22, blue: 127}, /* #29167f */

    'color-indigo-lighter': {red: 159, green: 168, blue: 218}, /* #9fa8da */
    'color-indigo-light': {red: 92, green: 107, blue: 192}, /* #5c6bc0 */
    'color-indigo-default': {red: 57, green: 73, blue: 171}, /* #3949ab */
    'color-indigo-dark': {red: 40, green: 53, blue: 147}, /* #283593 */
    'color-indigo-darker': {red: 21, green: 30, blue: 115}, /* #151e73 */

    'color-blue-lighter': {red: 144, green: 202, blue: 249}, /* #90caf9 */
    'color-blue-light': {red: 66, green: 165, blue: 245}, /* #42a5f5 */
    'color-blue-default': {red: 30, green: 136, blue: 229}, /* #1e88e5 */
    'color-blue-dark': {red: 21, green: 101, blue: 192}, /* #1565c0 */
    'color-blue-darker': {red: 10, green: 60, blue: 138}, /* #0a3c8a */

    'color-sky-lighter': {red: 129, green: 212, blue: 250}, /* #81d4fa */
    'color-sky-light': 'lime-brand-color-simple-blue',
    'color-sky-default': {red: 3, green: 155, blue: 229}, /* #039be5 */
    'color-sky-dark': {red: 2, green: 119, blue: 189}, /* #0277bd */
    'color-sky-darker': {red: 1, green: 81, blue: 144}, /* #015190 */

    'color-cyan-lighter': {red: 128, green: 222, blue: 234}, /* #80deea */
    'color-cyan-light': {red: 38, green: 198, blue: 218}, /* #26c6da */
    'color-cyan-default': {red: 0, green: 172, blue: 193}, /* #00acc1 */
    'color-cyan-dark': {red: 0, green: 131, blue: 143}, /* #00838f */
    'color-cyan-darker': {red: 0, green: 89, blue: 93}, /* #00595d */

    'color-teal-lighter': {red: 128, green: 203, blue: 196}, /* #80cbc4 */
    'color-teal-light': 'lime-brand-color-flexible-turquoise',
    'color-teal-default': {red: 0, green: 137, blue: 123}, /* #00897b */
    'color-teal-dark': {red: 0, green: 105, blue: 92}, /* #00695c */
    'color-teal-darker': {red: 1, green: 82, blue: 69}, /* #015245 */

    'color-green-lighter': {red: 165, green: 214, blue: 167}, /* #a5d6a7 */
    'color-green-light': 'lime-brand-color-lime-green',
    'color-green-default': {red: 67, green: 160, blue: 71}, /* #43a047 */
    'color-green-dark': {red: 46, green: 125, blue: 50}, /* #2e7d32 */
    'color-green-darker': {red: 32, green: 97, blue: 37}, /* #206125 */

    'color-lime-lighter': {red: 197, green: 225, blue: 165}, /* #c5e1a5 */
    'color-lime-light': {red: 156, green: 204, blue: 101}, /* #9ccc65 */
    'color-lime-default': {red: 124, green: 179, blue: 66}, /* #7cb342 */
    'color-lime-dark': {red: 85, green: 139, blue: 47}, /* #558b2f */
    'color-lime-darker': {red: 43, green: 90, blue: 25}, /* #2b5a19 */

    'color-grass-lighter': {red: 230, green: 238, blue: 156}, /* #e6ee9c */
    'color-grass-light': {red: 212, green: 225, blue: 87}, /* #d4e157 */
    'color-grass-default': {red: 192, green: 202, blue: 51}, /* #c0ca33 */
    'color-grass-dark': {red: 158, green: 157, blue: 36}, /* #9e9d24 */
    'color-grass-darker': {red: 119, green: 109, blue: 19}, /* #776d13 */

    'color-yellow-lighter': {red: 255, green: 245, blue: 157}, /* #fff59d */
    'color-yellow-light': {red: 255, green: 238, blue: 88}, /* #ffee58 */
    'color-yellow-default': {red: 253, green: 216, blue: 53}, /* #fdd835 */
    'color-yellow-dark': {red: 245, green: 200, blue: 39}, /* #f5c827 */
    'color-yellow-darker': {red: 224, green: 180, blue: 21}, /* #e0b415 */

    'color-amber-lighter': {red: 255, green: 224, blue: 130}, /* #ffe082 */
    'color-amber-light': 'lime-brand-color-yellow',
    'color-amber-default': 'lime-brand-color-orange',
    'color-amber-dark': {red: 255, green: 143, blue: 0}, /* #ff8f00 */
    'color-amber-darker': {red: 222, green: 98, blue: 2}, /* #de6202 */

    'color-orange-lighter': {red: 255, green: 204, blue: 128}, /* #ffcc80 */
    'color-orange-light': {red: 255, green: 167, blue: 38}, /* #ffa726 */
    'color-orange-default': {red: 251, green: 140, blue: 0}, /* #fb8c00 */
    'color-orange-dark': {red: 239, green: 108, blue: 0}, /* #ef6c00 */
    'color-orange-darker': {red: 216, green: 77, blue: 1}, /* #d84d01 */

    'color-coral-lighter': {red: 255, green: 171, blue: 145}, /* #ffab91 */
    'color-coral-light': 'lime-brand-color-sellable-orange',
    'color-coral-default': {red: 244, green: 81, blue: 30}, /* #f4511e */
    'color-coral-dark': {red: 216, green: 67, blue: 21}, /* #d84315 */
    'color-coral-darker': {red: 181, green: 50, blue: 10}, /* #b5320a */

    'color-brown-lighter': {red: 188, green: 170, blue: 164}, /* #bcaaa4 */
    'color-brown-light': {red: 141, green: 110, blue: 99}, /* #8d6e63 */
    'color-brown-default': {red: 109, green: 76, blue: 65}, /* #6d4c41 */
    'color-brown-dark': {red: 78, green: 52, blue: 46}, /* #4e342e */
    'color-brown-darker': {red: 51, green: 32, blue: 28}, /* #33201c */

    'color-gray-lighter': {red: 238, green: 238, blue: 238}, /* #eee */
    'color-gray-light': 'lime-brand-color-light-grey',
    'color-gray-default': {red: 117, green: 117, blue: 117}, /* #757575 */
    'color-gray-dark': {red: 66, green: 66, blue: 66}, /* #424242 */
    'color-gray-darker': {red: 33, green: 32, blue: 32}, /* #212020 */

    'color-glaucous-lighter': {red: 159, green: 194, blue: 208}, /* #9fc2d0 */
    'color-glaucous-light': {red: 110, green: 141, blue: 156}, /* #6e8d9c */
    'color-glaucous-default': {red: 68, green: 108, blue: 128}, /* #446c80 */
    'color-glaucous-dark': {red: 42, green: 87, blue: 107}, /* #2a576b */
    'color-glaucous-darker': {red: 34, green: 65, blue: 80}, /* #224150 */
};
