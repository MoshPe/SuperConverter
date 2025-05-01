export namespace main {
	
	export class Angle {
	    Azimuth: number;
	    Elevation: number;
	
	    static createFrom(source: any = {}) {
	        return new Angle(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Azimuth = source["Azimuth"];
	        this.Elevation = source["Elevation"];
	    }
	}
	export class DmmAngle {
	    Deg: number;
	    Min: number;
	    Str: string;
	
	    static createFrom(source: any = {}) {
	        return new DmmAngle(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Deg = source["Deg"];
	        this.Min = source["Min"];
	        this.Str = source["Str"];
	    }
	}
	export class Dmm {
	    LatNS: DmmAngle;
	    LonWE: DmmAngle;
	
	    static createFrom(source: any = {}) {
	        return new Dmm(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.LatNS = this.convertValues(source["LatNS"], DmmAngle);
	        this.LonWE = this.convertValues(source["LonWE"], DmmAngle);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class DmmFoot {
	    LatNS: DmmAngle;
	    LonWE: DmmAngle;
	    Foot: number;
	
	    static createFrom(source: any = {}) {
	        return new DmmFoot(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.LatNS = this.convertValues(source["LatNS"], DmmAngle);
	        this.LonWE = this.convertValues(source["LonWE"], DmmAngle);
	        this.Foot = source["Foot"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class DmsAngle {
	    Deg: number;
	    Min: number;
	    Sec: number;
	    Str: string;
	
	    static createFrom(source: any = {}) {
	        return new DmsAngle(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Deg = source["Deg"];
	        this.Min = source["Min"];
	        this.Sec = source["Sec"];
	        this.Str = source["Str"];
	    }
	}
	export class Dms {
	    LatNS: DmsAngle;
	    LonWE: DmsAngle;
	
	    static createFrom(source: any = {}) {
	        return new Dms(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.LatNS = this.convertValues(source["LatNS"], DmsAngle);
	        this.LonWE = this.convertValues(source["LonWE"], DmsAngle);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ECEF {
	    X: number;
	    Y: number;
	    Z: number;
	
	    static createFrom(source: any = {}) {
	        return new ECEF(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.X = source["X"];
	        this.Y = source["Y"];
	        this.Z = source["Z"];
	    }
	}
	export class Geo {
	    Lat: number;
	    Lng: number;
	    Alt: number;
	
	    static createFrom(source: any = {}) {
	        return new Geo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Lat = source["Lat"];
	        this.Lng = source["Lng"];
	        this.Alt = source["Alt"];
	    }
	}
	export class UnitValue {
	    Val: number;
	    Str: string;
	
	    static createFrom(source: any = {}) {
	        return new UnitValue(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.Val = source["Val"];
	        this.Str = source["Str"];
	    }
	}

}

