//////////////////////////////////////////////////
/////     MATRIX ALGEBRA AND GEOMETRIC TRANSFORMS 
//////////////////////////////////////////////////

function matrix_copy(m1) {
    // returns 2D array that is a copy of m1

    var mat = [];
    var i,j;

    for (i=0;i<m1.length;i++) { // for each row of m1
        mat[i] = [];
        for (j=0;j<m1[0].length;j++) { // for each column of m1
            mat[i][j] = m1[i][j];
        }
    }
    return mat;
}


/* STENCIL START */ 
function matrix_multiply(m1,m2) {
    // returns 2D array that is the result of m1*m2
    // inefficient matrix multiplication
    var mat = [];
    var i,j,k;

    // flag error if number of columns in m1 do not match number of rows in m2
    if (m1[0].length !== m2.length) {
        console.log("matrix multiplication error: dimensions do not match");
        return false;
    }

    for (i=0;i<m1.length;i++) { // for each row of m1
        mat[i] = [];
        for (j=0;j<m2[0].length;j++) { // for each column of m2
            mat[i][j] = 0;
            for (k=0;k<m1[0].length;k++) {
                mat[i][j] += m1[i][k]*m2[k][j];
            }
        }
    }
    return mat;
}

function matrix_transpose(m) {
    var i;
    mat = []; 
    for (i=0;i<m[0].length;i++) {
        mat[i] = [];
        for (j=0;j<m.length;j++) {
            mat[i][j] = Number(m[j][i]);  // ensure this element is a number and not an array
        }
    }
    return mat;
}

function matrix_pseudoinverse(m) {
    if (m[0].length == m.length) {  // if matrix is square, it can be inverted directly
        //console.log("pseudoinverse r=c: "+m[0].length+" "+m.length);
        return numeric.inv(m);
    }
    else if (m[0].length < m.length) { // if matrix has more columns than rows, return left pseudo-inverse
        //console.log("pseudoinverse r<c: "+m[0].length+" "+m.length);
        var mt = matrix_transpose(m);
        var square_mat = matrix_multiply(mt,m);  // this square matrix will be inverted
        return matrix_multiply(numeric.inv( square_mat ), mt );
    }
    else { // if matrix has more rows than columns, return right pseudo-inverse
        //console.log("pseudoinverse r>c: "+m[0].length+" "+m.length);
        mt = matrix_transpose(m);
        square_mat = matrix_multiply(m,mt);  // this square matrix will be inverted
        return matrix_multiply(mt, numeric.inv( square_mat ) );
    }

}

function matrix_invert_affine(m) {
    var m_rot_inv = matrix_transpose(m); 
    m_rot_inv[3] = [0,0,0,1];
    var m_trn = [[m[0][3]],[m[1][3]],[m[2][3]],[1]];
    var m_trn_inv = matrix_multiply(m_rot_inv,m_trn); 
    var m_inv = matrix_multiply(m_rot_inv,generate_identity());
    m_inv[0][3] = -m_trn_inv[0][0]; 
    m_inv[1][3] = -m_trn_inv[1][0]; 
    m_inv[2][3] = -m_trn_inv[2][0]; 
    return m_inv;
}

function vector_normalize(v) {
    var i;
    var tempsum = 0;
    for (i=0;i<v.length;i++) {
        tempsum += Number(v[i])*Number(v[i]);
        //tempsum += v[i]*v[i];
    }
    var magnitude = Math.sqrt(tempsum);

    vec = []; 
    for (i=0;i<v.length;i++) {
        if (typeof v[0][0] === 'undefined')
           vec[i] = v[i]/magnitude;
        else {
           vec[i] = [];
           vec[i][0] = v[i]/magnitude;
        }
    }
    return vec;
}

function vector_cross(a,b) {
    c = [];
    if (typeof a[0][0] === 'undefined') { // not a good check for dimensions
        // assume a and b are 1D vectors
        c[0] = a[1]*b[2] - a[2]*b[1];
        c[1] = a[2]*b[0] - a[0]*b[2];
        c[2] = a[0]*b[1] - a[1]*b[0];
    }
    else {
        c[0] = [a[1]*b[2] - a[2]*b[1]];
        c[1] = [a[2]*b[0] - a[0]*b[2]];
        c[2] = [a[0]*b[1] - a[1]*b[0]];
    }
    return c;
}

function generate_identity() {
    // returned matrix is a 2D array
    var mat = [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1] ];
    return mat;
}


function generate_translation_matrix(tx, ty, tz) {
    // returned matrix is a 2D array
    var mat = [
                [1, 0, 0, tx],
                [0, 1, 0, ty],
                [0, 0, 1, tz],
                [0, 0, 0, 1] ];
    return mat;
}

function generate_rotation_matrix_X(angle) {
    // returned matrix is a 2D array
    var mat = [
                [1, 0, 0, 0],
                [0, Math.cos(angle), -Math.sin(angle), 0],
                [0, Math.sin(angle), Math.cos(angle), 0],
                [0, 0, 0, 1] ];
    return mat;
}


function generate_rotation_matrix_Y(angle) {
    // returned matrix is a 2D array
    var mat = [
                [Math.cos(angle), 0, Math.sin(angle), 0],
                [0, 1, 0, 0],
                [-Math.sin(angle), 0, Math.cos(angle), 0],
                [0, 0, 0, 1] ];
    return mat;
}

function generate_rotation_matrix_Z(angle) {
    // returned matrix is a 2D array
    var mat = [
                [Math.cos(angle), -Math.sin(angle), 0, 0],
                [Math.sin(angle), Math.cos(angle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1] ];
    return mat;
}

/* STENCIL REPLACE START
    // STENCIL: reference matrix code has the following functions:
    //   matrix_multiply
    //   matrix_transpose
    //   matrix_pseudoinverse
    //   matrix_invert_affine
    //   vector_normalize
    //   vector_cross
    //   generate_identity
    //   generate_translation_matrix
    //   generate_rotation_matrix_X
    //   generate_rotation_matrix_Y
    //   generate_rotation_matrix_Z
STENCIL REPLACE */ 
/* STENCIL END */ 
