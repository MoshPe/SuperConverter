export namespace main {
	
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

