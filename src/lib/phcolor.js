/*
 * phuecolor.d
 * Defines Color struct, a few pre-defined named colors, and
 * a few handy functions for adjusting and mixing colors.
 * All Colors are using the CIE (1931) x,y system
 * 
 * (c) Daren Scot Wilson 2022
 */


/*  
Color data struct as used in D language for PhueCmd
struct PhueColor     now called "ciecolor"
{
    float bri;     // brightness, 0 to 1,  with 1 = bulb at max brightness ("bri":255)
    float ciex, ciey;   // color coords, 0 to 1, confined to "shoe heel" region of CIE chart
}
*/


// A few canned standard colors
// L  is 0.9 or less than 1
export const WHITED50      = { bri: 0.9,  ciex: 0.3457, ciey: 0.3585 };  
export const WHITED65      = { bri: 0.8,  ciex: 0.3127, ciey: 0.3290 };
export const WHITEEQUAL    = { bri: 0.8,  ciex: 0.3333, ciey: 0.3333 };
export const ZERO_COLOR    = { bri: 0.0,  ciex: 0.3333, ciey: 0.3333 };
export const PHGAMUT_GREEN = { bri: 0.8,  ciex: 0.300,  ciey: 0.59   };   // green corner of phue gamut
export const PHGAMUT_RED   = { bri: 0.8,  ciex: 0.64,   ciey: 0.33   };   // red corner  ''
export const PHGAMUT_BLUE  = { bri: 0.8,  ciex: 0.145,  ciey: 0.045  };   // blue-violet corner ''
export const GREEN         = { bri: 0.8,  ciex: 0.24,   ciey: 0.40   };
export const YELLOW        = { bri: 0.8,  ciex: 0.36,   ciey: 0.45   };   

   
// Return color brightened by given factor, 1.0 for same, 0.0 black, 10.0 for 10x etc
export function brighten(ciecolor, factor)  {
    let R = ciecolor;
    R.bri *= factor;
    if (R.bri > 1.0)  R.bri = 1.0;
    return R;
}



export function random_color_cie( 
            minbri=0.1, 
            maxbri = 1.0
            )   {
    // For random x,y, first pick random point in a square, 0 to 1 each dimension
    // If in upper-right diagonal half, flip to lower-left half.
    // Then affine transform to fit Phue gamut in CIE chart, simple vector addition.
    // Blue-violet corner B is the "origin" and R-B and G-B are as if unit vectors.
    // TODO:  I'm using hardcoded gamut RGB, but ideally would get these from the hardware bulbs.
    
    let a = Math.random();
    let b = Math.random();
    if (a+b>1)  { 
        a=1-a; b=1-b; 
    }

    let x = PHGAMUT_BLUE.ciex + (PHGAMUT_RED.ciex-PHGAMUT_BLUE.ciex)*a + (PHGAMUT_GREEN.ciex-PHGAMUT_BLUE.ciex)*b; 
    let y = PHGAMUT_BLUE.ciey+ (PHGAMUT_RED.ciey-PHGAMUT_BLUE.ciey)*a + (PHGAMUT_GREEN.ciey-PHGAMUT_BLUE.ciey)*b; 
    
console.log(a,b,x,y,minbri,maxbri);
    let ciecolor = {
        bri: minbri + Math.random()*(maxbri-minbri),
        ciex: x,
        ciey: y
    };
    return ciecolor;
}


export function random_color_json(minbri=0.1, maxbri=1.0)   {
    const R = random_color(minbri,maxbri);
    const json = {
        'bri':  Math.trunc(R.bri*255),
        'xy':  [ R.ciex, R.ciey ]
    }
    return json;
}


/*
 * Mix two colors.  
 * frac_toward = 0 returns original color.  1.0 returns target.
 * Mixing done linearly in CIE Lxy space.
 * Note: this does not clip frac_toward to 0 -- 1 range, in case you want to do crazy things
 */
export function mixcolors(orig,  frac_toward,  target) {
    const mix = frac_toward;
    const fade = 1.0 - mix;
    let M = {
        bri:   fade*orig.bri + mix*target.bri,
        ciex:  fade*orig.ciex   + mix*target.ciex,
        ciey:  fade*orig.ciey   + mix*target.ciey
    }
    return M; 
}


/* 
 * Same as mix but with easing defined by sine function 
 */
export function  mixcolors_sine(orig,  frac_toward,  target)  {
    return mixcolors(orig,  (1 - Math.cos(frac_toward*Math.PI))/2,  target);
}




const  min_color_temp =  1300.0; 
const  max_color_temp = 20000.0; 


export function blackbody_color(temp)   {
	// https://en.wikipedia.org/wiki/Planckian_locus 
    // Brightness should go up with temperature acc'd to Stefan-Boltzmann law
    // but Color.L, proportional to a bulb's "bri", isn't physical. 
    // We make a simple approximation, not letting brightness get too low for the min temp
    
    if (temp < min_color_temp) temp = min_color_temp;
    if (temp > max_color_temp) temp = max_color_temp;
    
	let m = 1000.0/temp;
	let x = 0.1;
    let y = 0.1;
	
	if (temp<=4000.0)  {
		x = ((-0.2661239*m - 0.2343589)*m + 0.8776956)*m + 0.179910;
		if (temp<2222.0)  
			y = ((-1.1063814*x - 1.34811020)*x + 2.18555832)*x - 0.20219683;
		else
			y = ((-0.9549476*x - 1.37418593)*x + 2.09137015)*x - 0.16748867;
		
	}else{
		x = ((-3.0258469*m + 2.10703790)*m + 0.2226347)*m + 0.240390;
		y = (( 3.0817580*x - 5.87338670)*x + 3.75112997)*x - 0.37001483;
	}
    let b = 1.0 + 1000.0/max_color_temp - m;
	return {bri: 1.0,  ciex: x,  ciey: y};
}


function isclose(x, y, tol=0.002) {
    let ok = Math.abs(x-y) < tol;
    if (!ok)  {
        console.log(`Failed to match:  ${x} === ${y}`);
    }
    return ok;
}


let ngood = 0;
let ntests = 0;
function assert( oughta_be_true )   {
    ntests += 1;
    if ( oughta_be_true )   {
        ngood+=1;
    } else  {
        console.log(`unit test ${ntests} failed`);
    }
}



export function unittest_colors() {
    // import std.stdio;
    ngood = 0;
    ntests = 0;
    
    
    const A = { bri: 0.2,  ciex: 0.2,  ciey: 0.6 };
    const B = { bri: 1.0,  ciex: 0.6,  ciey: 0.8 };
    
    let mixA = mixcolors(A, 0.0, B);
    console.log(A, B, mixA);    
    assert( isclose(mixA.bri, A.bri) );
    assert( isclose(mixA.ciex, A.ciex) );
    assert( isclose(mixA.ciey, A.ciey) );
    
    let mixB = mixcolors(A, 1.0, B);
    assert( isclose(mixB.bri, B.bri) );
    assert( isclose(mixB.ciex, B.ciex) );
    assert( isclose(mixB.ciey, B.ciey) );
    
    let half = mixcolors(A, 0.5, B);
    assert( isclose(half.bri, 0.6) );
    assert( isclose(half.ciex, 0.4) );
    assert( isclose(half.ciey, 0.7) );
    
    const cool = blackbody_color(2000);
    assert( isclose(cool.ciex, 0.525, 0.007) );  // looking at diagram by eye
    assert( isclose(cool.ciey, 0.415, 0.007) );
    
    console.log(`Ran ${ntests} with ${ngood} passing.`);
}
