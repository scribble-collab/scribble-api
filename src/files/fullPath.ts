import _ from 'ramda';
import config from '../config';

export default function getPath(fileName: any) {
    if (_.isNil(fileName) || _.isEmpty(fileName)) {
        return null;
    }
    return `${config.STATIC_FILES_BASE_PATH}/${fileName}`;
}
