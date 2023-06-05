export default class AccountHelper{
    randomNameGenerator = (num:number):string => {
        let res = '';
        for(let i = 0; i < num; i++){
            const random = Math.floor(Math.random() * 27);
            res += String.fromCharCode(97 + random);
        };
        return res;
    };

    withoutProperty(obj, property) {
        const { [property]: unused, ...rest } = obj

        return rest
    }

    randomCodeGenerator = (result_length: number): string => {
        let characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        let result = ''
         // Customize the length here.
        for (let i = result_length; i > 0; --i) result += characters[Math.round(Math.random() * (characters.length - 1))]
        return result;
    }
}