import com.tamina.cow4.model.Cell;
import com.tamina.cow4.data.Mock;
import haxe.unit.TestCase;

class MockTest extends TestCase {

    var mock:Mock;

    override public function setup() {
        mock = Mock.instance;
        Reflect.setField(mock, 'row', 10);
        Reflect.setField(mock, 'column', 10);
        Reflect.setField(mock, 'goRight', true);
    }

    public function testFillCell(){

        var cell:Cell = Reflect.callMethod(mock, 'fillCell', [null, 1]);
        assertTrue(cell.left == null);

        var cell:Cell = Reflect.callMethod(mock, 'fillCell', [new Cell(), 5]);
        assertTrue(cell.left == new Cell());

        var cell:Cell = Reflect.callMethod(mock, 'fillCell', [new Cell(), 11]);
        assertTrue(cell.top == new Cell());
        assertFalse(Reflect.field(mock, 'goRight'));

        var cell:Cell = Reflect.callMethod(mock, 'fillCell', [new Cell(), 15]);
        assertTrue(cell.right == new Cell());

        var cell:Cell = Reflect.callMethod(mock, 'fillCell', [new Cell(), 21]);
        assertTrue(cell.top == new Cell());
        assertTrue(Reflect.field(mock, 'goRight'));

    }
}
